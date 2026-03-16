import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/mongo';

const router = Router();

interface VisitorDoc {
  tenantId: string;
  visitorId: string;
  ip?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  country?: string;
  city?: string;
  firstVisit: Date;
  lastVisit: Date;
  pageViews: number;
  pages: string[];
}

interface PageViewDoc {
  tenantId: string;
  visitorId: string;
  page: string;
  referrer?: string;
  timestamp: Date;
}

// Track a page view
router.post('/:tenantId/track', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { visitorId, page, referrer, userAgent, device, browser } = req.body;
    
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const db = await getDatabase();
    const visitorsCollection = db.collection<VisitorDoc>('visitors');
    const pageViewsCollection = db.collection<PageViewDoc>('page_views');
    
    const now = new Date();
    
    // Upsert visitor
    await visitorsCollection.updateOne(
      { tenantId, visitorId },
      {
        $set: {
          lastVisit: now,
          userAgent,
          device,
          browser,
        },
        $setOnInsert: {
          tenantId,
          visitorId,
          firstVisit: now,
        },
        $inc: { pageViews: 1 },
        $addToSet: { pages: page }
      },
      { upsert: true }
    );
    
    // Record page view
    await pageViewsCollection.insertOne({
      tenantId,
      visitorId,
      page: page || '/',
      referrer,
      timestamp: now
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
});

// Get visitor stats
router.get('/:tenantId/stats', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { period = '7d', startDate: customStart, endDate: customEnd, month, year } = req.query;
    
    const db = await getDatabase();
    const visitorsCollection = db.collection<VisitorDoc>('visitors');
    const pageViewsCollection = db.collection<PageViewDoc>('page_views');
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    // Handle custom date range
    if (customStart && customEnd) {
      startDate = new Date(customStart as string);
      endDate = new Date(customEnd as string);
      endDate.setHours(23, 59, 59, 999);
    } else if (month && year) {
      // Handle month/year selection
      const monthNum = parseInt(month as string) - 1; // 0-indexed
      const yearNum = parseInt(year as string);
      startDate = new Date(yearNum, monthNum, 1);
      endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
    } else {
      switch (period) {
        case 'day':
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case 'month':
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'year':
        case '365d':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        case 'all':
          startDate = new Date(0);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }
    }
    
    // Total unique visitors
    const totalVisitors = await visitorsCollection.countDocuments({ tenantId });
    
    // Visitors in period
    const periodVisitors = await visitorsCollection.countDocuments({
      tenantId,
      lastVisit: { $gte: startDate }
    });
    
    // Today's visitors
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayVisitors = await visitorsCollection.countDocuments({
      tenantId,
      lastVisit: { $gte: todayStart }
    });
    
    // Total page views in period
    const totalPageViews = await pageViewsCollection.countDocuments({
      tenantId,
      timestamp: { $gte: startDate }
    });
    
    // Page views by day (last 7 days)
    const dailyStats = await pageViewsCollection.aggregate([
      {
        $match: {
          tenantId,
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' }
        }
      },
      {
        $project: {
          date: '$_id',
          views: 1,
          visitors: { $size: '$uniqueVisitors' }
        }
      },
      { $sort: { date: 1 } }
    ]).toArray();
    
    // Top pages
    const topPages = await pageViewsCollection.aggregate([
      {
        $match: {
          tenantId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$page',
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $project: {
          page: '$_id',
          views: 1,
          _id: 0
        }
      }
    ]).toArray();
    
    // Device breakdown
    const devices = await visitorsCollection.aggregate([
      {
        $match: {
          tenantId,
          lastVisit: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$device',
          count: { $sum: 1 }
        }
      }
    ]).toArray() as { _id: string | null; count: number }[];

    // Daily device breakdown for chart (last 7 days or custom period)
    const dailyDeviceStats = await visitorsCollection.aggregate([
      {
        $match: {
          tenantId,
          lastVisit: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$lastVisit' } },
            device: { $ifNull: ['$device', 'Desktop'] }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          devices: {
            $push: {
              device: '$_id.device',
              count: '$count'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Transform daily device stats into chart format
    const chartData = dailyDeviceStats.map((day: any) => {
      const mobileCount = day.devices.find((d: any) => d.device?.toLowerCase() === 'mobile')?.count || 0;
      const tabletCount = day.devices.find((d: any) => d.device?.toLowerCase() === 'tablet')?.count || 0;
      const desktopCount = day.devices.find((d: any) => d.device?.toLowerCase() === 'desktop' || !d.device)?.count || 0;
      
      return {
        date: day._id,
        mobile: mobileCount,
        tablet: tabletCount,
        desktop: desktopCount
      };
    });
    
    res.json({
      totalVisitors,
      periodVisitors,
      todayVisitors,
      totalPageViews,
      dailyStats,
      topPages,
      devices: devices.map(d => ({ device: d._id || 'Unknown', count: d.count })),
      chartData
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ error: 'Failed to get visitor stats' });
  }
});

// Get online visitors count (visitors active in last 5 minutes)
router.get('/:tenantId/online', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    
    const db = await getDatabase();
    const visitorsCollection = db.collection<VisitorDoc>('visitors');
    
    // Consider visitors "online" if they were active in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const onlineCount = await visitorsCollection.countDocuments({
      tenantId,
      lastVisit: { $gte: fiveMinutesAgo }
    });
    
    res.json({ online: onlineCount });
  } catch (error) {
    console.error('Error getting online visitors:', error);
    res.status(500).json({ error: 'Failed to get online count' });
  }
});

// Get traffic sources (referrer analysis)
router.get('/:tenantId/sources', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { period = '7d' } = req.query;

    const db = await getDatabase();
    const pageViewsCollection = db.collection<PageViewDoc>('page_views');

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case 'month':
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'year':
      case '365d':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Aggregate referrers
    const referrerData = await pageViewsCollection.aggregate([
      {
        $match: {
          tenantId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' }
        }
      },
      {
        $project: {
          referrer: '$_id',
          count: 1,
          visitors: { $size: '$uniqueVisitors' },
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    // Categorize referrers into sources
    const sourceMap: Record<string, { count: number; visitors: number; referrers: string[] }> = {};

    const categorizeReferrer = (referrer: string | null | undefined): string => {
      if (!referrer || referrer === '' || referrer === 'null' || referrer === 'undefined') return 'Direct';

      const ref = referrer.toLowerCase();

      if (ref.includes('google.com') || ref.includes('google.co')) return 'Google Search';
      if (ref.includes('facebook.com') || ref.includes('fb.com') || ref.includes('fb.me')) return 'Facebook';
      if (ref.includes('instagram.com')) return 'Instagram';
      if (ref.includes('youtube.com') || ref.includes('youtu.be')) return 'YouTube';
      if (ref.includes('twitter.com') || ref.includes('x.com') || ref.includes('t.co')) return 'Twitter/X';
      if (ref.includes('tiktok.com')) return 'TikTok';
      if (ref.includes('linkedin.com')) return 'LinkedIn';
      if (ref.includes('pinterest.com')) return 'Pinterest';
      if (ref.includes('reddit.com')) return 'Reddit';
      if (ref.includes('whatsapp.com') || ref.includes('wa.me')) return 'WhatsApp';
      if (ref.includes('telegram.org') || ref.includes('t.me')) return 'Telegram';
      if (ref.includes('bing.com')) return 'Bing';
      if (ref.includes('yahoo.com')) return 'Yahoo';
      if (ref.includes('baidu.com')) return 'Baidu';

      return 'Other';
    };

    for (const item of referrerData) {
      const source = categorizeReferrer(item.referrer);
      if (!sourceMap[source]) {
        sourceMap[source] = { count: 0, visitors: 0, referrers: [] };
      }
      sourceMap[source].count += item.count;
      sourceMap[source].visitors += item.visitors;
      if (item.referrer && !sourceMap[source].referrers.includes(item.referrer)) {
        sourceMap[source].referrers.push(item.referrer);
      }
    }

    // Convert to array and calculate percentages
    const totalViews = Object.values(sourceMap).reduce((sum, s) => sum + s.count, 0) || 1;
    const sources = Object.entries(sourceMap)
      .map(([name, data]) => ({
        name,
        count: data.count,
        visitors: data.visitors,
        percentage: Math.round((data.count / totalViews) * 100),
        referrers: data.referrers.slice(0, 5) // Top 5 referrer URLs per source
      }))
      .sort((a, b) => b.count - a.count);

    // Daily source breakdown for chart
    const dailySources = await pageViewsCollection.aggregate([
      {
        $match: {
          tenantId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            referrer: '$referrer'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          referrers: {
            $push: {
              referrer: '$_id.referrer',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Transform daily data with categorized sources
    const dailySourceData = dailySources.map((day: any) => {
      const daySources: Record<string, number> = {};
      for (const ref of day.referrers) {
        const source = categorizeReferrer(ref.referrer);
        daySources[source] = (daySources[source] || 0) + ref.count;
      }
      return {
        date: day._id,
        total: day.total,
        ...daySources
      };
    });

    // Get online visitors with their referrer info
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const onlineVisitors = await pageViewsCollection.aggregate([
      {
        $match: {
          tenantId,
          timestamp: { $gte: fiveMinutesAgo }
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$visitorId',
          lastPage: { $first: '$page' },
          referrer: { $first: '$referrer' },
          lastSeen: { $first: '$timestamp' }
        }
      }
    ]).toArray();

    const onlineBySource: Record<string, number> = {};
    for (const v of onlineVisitors) {
      const source = categorizeReferrer(v.referrer);
      onlineBySource[source] = (onlineBySource[source] || 0) + 1;
    }

    res.json({
      sources,
      dailySourceData,
      onlineCount: onlineVisitors.length,
      onlineBySource,
      onlineVisitors: onlineVisitors.map((v: any) => ({
        visitorId: v._id,
        page: v.lastPage,
        source: categorizeReferrer(v.referrer),
        lastSeen: v.lastSeen
      })),
      totalViews,
      period
    });
  } catch (error) {
    console.error('Error getting traffic sources:', error);
    res.status(500).json({ error: 'Failed to get traffic sources' });
  }
});

export const visitorsRouter = router;
