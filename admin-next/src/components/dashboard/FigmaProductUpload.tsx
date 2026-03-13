import React from 'react';
import { ChevronUp, Plus, Upload, Youtube, Scan, X, ArrowLeft, FolderOpen, Calendar } from 'lucide-react';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';
import { GalleryPicker } from '../GalleryPicker';
import { RichTextEditor } from '../RichTextEditor';
import { FigmaProductUploadProps } from './product-upload/types';
import { AddCircleIcon, DraftIcon } from './product-upload/icons';
import { Section, InputField, Toggle, SelectField } from './product-upload/ui';
import { useProductForm } from './product-upload/useProductForm';

const FigmaProductUpload: React.FC<FigmaProductUploadProps> = ({
  categories,
  subCategories = [],
  childCategories = [],
  brands,
  tags = [],
  onAddProduct,
  onBack,
  onNavigate,
  editProduct,
}) => {
  const {
    formData,
    isDragging,
    uploadingVariantImage,
    uploadingCatalogImage,
    showCatalogModal,
    setShowCatalogModal,
    catalogModalTab,
    setCatalogModalTab,
    newCatalogItem,
    setNewCatalogItem,
    savingCatalog,
    showGalleryPicker,
    setShowGalleryPicker,
    galleryPickerTarget,
    setGalleryPickerTarget,
    galleryPickerVariantKey,
    setGalleryPickerVariantKey,
    localCategories,
    localSubCategories,
    localChildCategories,
    localBrands,
    localTags,
    fileInputRef,
    unfilteredFileInputRef,
    variantImageRefs,
    catalogImageRef,
    updateField,
    openGalleryPicker,
    handleGallerySelect,
    handleGallerySelectMultiple,
    handleVariantImageUpload,
    handleRemoveVariantImage,
    handleImageUpload,
    handleUnfilteredImageUpload,
    handleRemoveUnfilteredImage,
    handleRemoveImage,
    handleSetAsMain,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCatalogImageUpload,
    handleSaveCatalogItem,
    handleSaveDraft,
    handlePublish,
    allImages,
    completionItems,
    completionPercentage,
    getProgressColor,
    affiliateSources,
  } = useProductForm({
    categories,
    subCategories,
    childCategories,
    brands,
    tags,
    onAddProduct,
    onBack,
    editProduct,
  });

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-6 xxs:pb-8 font-['Lato']">
      {/* Header */}
      <div className="px-2 xxs:px-3 sm:px-4 lg:px-3 xl:px-4 py-3 xxs:py-4 sm:py-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              title="Back to Products"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <h1 className="text-base xxs:text-lg sm:text-xl lg:text-[24px] font-bold text-black">Product Upload</h1>
        </div>
      </div>

      <div className="px-2 xxs:px-3 sm:px-4 lg:px-3 xl:px-4 flex flex-col lg:flex-row gap-3 xxs:gap-4 lg:gap-4 xl:gap-5">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-3 xxs:space-y-4">
          {/* General Information */}
          <Section title="General Information">
            <div className="space-y-3 xxs:space-y-4">
              {/* Item Name */}
              <div className="flex flex-col gap-1.5 xxs:gap-2">
                <div className="flex flex-col xxs:flex-row xxs:items-center justify-between gap-1 xxs:gap-2">
                  <label className="text-[14px] xxs:text-[16px] text-black">
                    Item Name<span className="text-[#e30000]">*</span>
                  </label>
                  <Toggle 
                    label="Auto Slug" 
                    value={formData.autoSlug} 
                    onChange={(v) => updateField('autoSlug', v)}
                  />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    updateField('name', e.target.value);
                    if (formData.autoSlug) {
                      updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="Ex: Samsung Galaxy S25 Ultra"
                  className="w-full h-9 xxs:h-10 bg-[#f9f9f9] rounded-lg px-2 xxs:px-3 text-[13px] xxs:text-[14px] placeholder:text-[#a2a2a2] outline-none"
                />
                
                {/* Manual Slug Input - Only show when Auto Slug is OFF */}
                {!formData.autoSlug && (
                  <div className="mt-2">
                    <label className="text-[12px] xxs:text-[13px] text-gray-600 mb-1 block">
                      Product Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
                      placeholder="ex: samsung-galaxy-s25-ultra"
                      className="w-full h-9 xxs:h-10 bg-[#f9f9f9] rounded-lg px-2 xxs:px-3 text-[13px] xxs:text-[14px] placeholder:text-[#a2a2a2] outline-none border border-gray-300 focus:border-blue-500"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">URL-friendly name (lowercase, hyphens only)</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 xxs:gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] xxs:text-[16px] font-medium text-black">
                    Media<span className="text-[#da0000]">*</span>
                  </label>
                  <ChevronUp size={18} className="xxs:w-5 xxs:h-5" />
                </div>
                
                {/* Image Upload & Gallery */}
                <div 
                  className={`rounded-lg p-2 xxs:p-3 sm:p-4 transition-colors border-2 ${
                    isDragging 
                      ? 'bg-blue-50 border-blue-400 border-dashed' 
                      : 'bg-[#f9f9f9] border-transparent hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {/* Gallery Grid */}
                  {allImages.length > 0 ? (
                    <div className="space-y-3 xxs:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs xxs:text-sm text-gray-600">{allImages.length}/20 images</span>
                        {allImages.length < 20 && (
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs xxs:text-sm text-[#ff9f1c] hover:underline flex items-center gap-1"
                          >
                            <Plus size={12} className="xxs:w-[14px] xxs:h-[14px]" /> Add More
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 xxs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 xxs:gap-3">
                        {allImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                              idx === 0 ? 'border-[#ff9f1c] ring-2 ring-[#ff9f1c]/20' : 'border-gray-200'
                            }`}
                          >
                            <img src={normalizeImageUrl(img)} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <div className="absolute top-0.5 xxs:top-1 left-0.5 xxs:left-1 bg-[#ff9f1c] text-white text-[8px] xxs:text-[10px] px-1 xxs:px-1.5 py-0.5 rounded">
                                Main
                              </div>
                            )}
                            {/* Hover actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 xxs:gap-2">
                              {idx !== 0 && (
                                <button 
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleSetAsMain(idx); }}
                                  className="w-5 h-5 xxs:w-7 xxs:h-7 bg-white text-gray-700 rounded-full flex items-center justify-center text-[10px] xxs:text-xs hover:bg-[#ff9f1c] hover:text-white transition-colors"
                                  title="Set as Main"
                                >
                                  ★
                                </button>
                              )}
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                                className="w-5 h-5 xxs:w-7 xxs:h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="Remove"
                              >
                                <X size={12} className="xxs:w-[14px] xxs:h-[14px]" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {/* Add more placeholder */}
                        {allImages.length < 20 && (
                          <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-grid items-center justify-center gap-1 ml-1 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-gray-400 hover:text-[#ff9f1c] transition-colors"
                              title="Upload new image"
                            >
                              <Plus size={20} className="ml-4 xxs:w-6 xxs:h-6" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openGalleryPicker('gallery')}
                              className="text-gray-400 hover:text-[#ff9f1c] transition-colors"
                              title="Choose from gallery"
                            >
                              <FolderOpen size={16} className="xxs:w-5 xxs:h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-3 xxs:py-4 sm:py-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-[50px] h-[50px] xxs:w-[60px] xxs:h-[60px] sm:w-[76px] sm:h-[76px] mb-2 xxs:mb-3">
                        <Upload className="w-full h-full text-[#a2a2a2]" />
                      </div>
                      <p className="text-[13px] xxs:text-[14px] sm:text-[16px] text-[#a2a2a2] text-center">
                        Drag & drop images, or click to add.
                      </p>
                      <p className="text-[10px] xxs:text-[11px] sm:text-[12px] text-[#a2a2a2] text-center mt-1">
                        JPG, PNG (max 4MB). Up to 20 images.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3 xxs:mt-4">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="bg-[#ff9f1c] text-white px-3 xxs:px-4 py-1.5 xxs:py-2 rounded-lg text-[12px] xxs:text-[14px] font-semibold"
                        >
                          Add Product Image
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); unfilteredFileInputRef.current?.click(); }}
                          className="bg-emerald-600 text-white px-3 xxs:px-4 py-1.5 xxs:py-2 rounded-lg text-[12px] xxs:text-[14px] font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
                        >
                          <Scan size={14} />
                          Unfiltered Real Image
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openGalleryPicker('gallery'); }}
                          className="bg-gray-100 text-gray-700 px-3 xxs:px-4 py-1.5 xxs:py-2 rounded-lg text-[12px] xxs:text-[14px] font-semibold flex items-center gap-1.5 hover:bg-gray-200 transition-colors"
                        >
                          <FolderOpen size={14} />
                          Choose From Gallery
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    ref={unfilteredFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUnfilteredImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Unfiltered Real Images Section */}
                {(formData.unfilteredImages.length > 0 || allImages.length > 0) && (
                  <div className="mt-3 xxs:mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[13px] xxs:text-[14px] font-medium text-gray-700 flex items-center gap-1.5">
                        <Scan size={14} className="text-emerald-600" />
                        Unfiltered Real Images
                      </label>
                      <button
                        type="button"
                        onClick={() => unfilteredFileInputRef.current?.click()}
                        className="text-xs xxs:text-sm text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} className="xxs:w-[14px] xxs:h-[14px]" /> Add Authentic Shot
                      </button>
                    </div>
                    {formData.unfilteredImages.length > 0 ? (
                      <div className="grid grid-cols-3 xxs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 xxs:gap-3">
                        {formData.unfilteredImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-emerald-400 ring-2 ring-emerald-400/20"
                          >
                            <img src={normalizeImageUrl(img.url)} alt={`Authentic ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute top-0.5 xxs:top-1 left-0.5 xxs:left-1 bg-emerald-600 text-white text-[7px] xxs:text-[9px] px-1 xxs:px-1.5 py-0.5 rounded">
                              Authentic Shot
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveUnfilteredImage(idx); }}
                                className="w-5 h-5 xxs:w-7 xxs:h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="Remove"
                              >
                                <X size={12} className="xxs:w-[14px] xxs:h-[14px]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] xxs:text-[12px] text-gray-400 italic">No authentic/unfiltered images added yet.</p>
                    )}
                  </div>
                )}

                {/* Video URL */}
                <div className="relative">
                  <Youtube size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a2a2a2]" />
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => updateField('videoUrl', e.target.value)}
                    placeholder="Past YouTube Video Link (Optional)"
                    className="w-full h-10 bg-[#f9f9f9] rounded-lg pl-9 pr-3 text-[14px] placeholder:text-[#a2a2a2] outline-none"
                  />
                </div>
              </div>

              {/* Product Description */}
              <div className="flex flex-col gap-2">
                <RichTextEditor
                  label="Product Description"
                  value={formData.description}
                  onChange={(v) => updateField('description', v)}
                  placeholder="Enter product description..."
                  minHeight="min-h-[200px]"
                />
              </div>

              {/* Short Description */}
              <div className="flex flex-col gap-2">
                <RichTextEditor
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(v) => updateField('shortDescription', v)}
                  placeholder="Ex: Short Description"
                  minHeight="min-h-[100px]"
                />
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Pricing">
            <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 gap-2 xxs:gap-3 sm:gap-4 lg:gap-4 xl:gap-5">
              <InputField
                label="Sell/Current Price"
                required
                value={formData.salesPrice}
                onChange={(v) => updateField('salesPrice', parseFloat(v) || 0)}
                placeholder="0"
                type="number"
              />
              <InputField
                label="Regular/Old Price"
                required
                value={formData.regularPrice}
                onChange={(v) => updateField('regularPrice', parseFloat(v) || 0)}
                placeholder="0"
                type="number"
              />
              <InputField
                label="Cost Price (Optional)"
                value={formData.costPrice}
                onChange={(v) => updateField('costPrice', parseFloat(v) || 0)}
                placeholder="0"
                type="number"
              />
            </div>
          </Section>

          {/* Inventory */}
          <Section title="Inventory">
            <div className="space-y-3 xxs:space-y-4">
              <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 gap-2 xxs:gap-3 sm:gap-4 lg:gap-4 xl:gap-5">
                <InputField
                  label="Product serial"
                  value={formData.serial}
                  onChange={(v) => updateField('serial', parseFloat(v) || 0)}
                  placeholder="0%"
                  type="number"
                />
                <InputField
                  label="Quantity (Stock)"
                  value={formData.quantity}
                  onChange={(v) => updateField('quantity', parseInt(v) || 0)}
                  placeholder="50"
                  type="number"
                />
                <InputField
                  label="Unit Name"
                  value={formData.unitName}
                  onChange={(v) => updateField('unitName', v)}
                  placeholder="Piece, kg, liter, meter etc."
                />
              </div>
              <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 gap-2 xxs:gap-3 sm:gap-4 lg:gap-4 xl:gap-5">
                <InputField
                  label="Warranty"
                  value={formData.warranty}
                  onChange={(v) => updateField('warranty', v)}
                  placeholder="12 month"
                />
                <InputField
                  label="SKU / Product Code"
                  value={formData.sku}
                  onChange={(v) => updateField('sku', v)}
                  placeholder="ABC-XYZ-123"
                />
                <InputField
                  label="Bar Code"
                  value={formData.barcode}
                  onChange={(v) => updateField('barcode', v)}
                  placeholder="2154645786216"
                  rightIcon={<Scan size={18} className="text-gray-400 xxs:w-5 xxs:h-5" />}
                />
              </div>
              <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 gap-2 xxs:gap-3 sm:gap-4 lg:gap-4 xl:gap-5">
                <InputField
                  label="Initial Sold Count"
                  value={formData.initialSoldCount}
                  onChange={(v) => updateField('initialSoldCount', parseInt(v) || 0)}
                  placeholder="0"
                  type="number"
                />
                <InputField
                  label="Production Start"
                  value={formData.productionStart}
                  onChange={(v) => updateField('productionStart', v)}
                  placeholder="DD-MM-YYYY"
                  rightIcon={<Calendar size={18} className="text-gray-400 xxs:w-5 xxs:h-5" />}
                />
                <InputField
                  label="Expiration End"
                  value={formData.expirationEnd}
                  onChange={(v) => updateField('expirationEnd', v)}
                  placeholder="DD-MM-YYYY"
                  rightIcon={<Calendar size={18} className="text-gray-400 xxs:w-5 xxs:h-5" />}
                />
              </div>
            </div>
          </Section>

          {/* Product Variants */}
          <Section title="Product Variants" subtitle="You can add multiple variant for a single product here. Like Size, Color, and Weight etc.">
            <div className="space-y-4">
              {formData.variants.map((variant, vIdx) => (
                <div key={vIdx} className="border border-[#38bdf8] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[20px] font-medium">Make this variant mandatory</p>
                      <p className="text-[12px] text-[#a2a2a2]">Toggle this on if you want your customer to select at least one of the variant options</p>
                    </div>
                    <Toggle 
                      label="[No]" 
                      value={formData.variantsMandatory}
                      onChange={(v) => updateField('variantsMandatory', v)}
                    />
                  </div>

                  <InputField
                    label="Title"
                    value={variant.title}
                    onChange={(v) => {
                      const newVariants = [...formData.variants];
                      newVariants[vIdx].title = v;
                      updateField('variants', newVariants);
                    }}
                    placeholder="Enter the name of variant (e.g., Colour, Size, Material)"
                  />

                  {variant.options.map((option, oIdx) => (
                    <div key={oIdx} className="flex items-end gap-2 mt-4">
                      {/* Variant Image Upload */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => { variantImageRefs.current[`${vIdx}-${oIdx}`] = el; }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVariantImageUpload(vIdx, oIdx, file);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                        <div 
                          onClick={() => variantImageRefs.current[`${vIdx}-${oIdx}`]?.click()}
                          className="w-[67px] h-[67px] bg-[#f9f9f9] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#38bdf8] transition-colors"
                        >
                          {uploadingVariantImage === `${vIdx}-${oIdx}` ? (
                            <div className="animate-spin w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full" />
                          ) : option.image ? (
                            <img src={normalizeImageUrl(option.image)} alt="Variant" className="w-full h-full object-cover" />
                          ) : (
                            <Upload size={24} className="text-gray-400" />
                          )}
                        </div>
                        {option.image && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveVariantImage(vIdx, oIdx);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[16px] text-black">Attribute</label>
                          <input
                            value={option.attribute}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIdx].options[oIdx].attribute = e.target.value;
                              updateField('variants', newVariants);
                            }}
                            placeholder="Enter variant Option (e.g., Red, Large, Cotton)"
                            className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] placeholder:text-[#999] outline-none mt-2"
                          />
                        </div>
                        <div>
                          <label className="text-[16px] text-black">Extra Price</label>
                          <input
                            type="number"
                            value={option.extraPrice}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIdx].options[oIdx].extraPrice = parseFloat(e.target.value) || 0;
                              updateField('variants', newVariants);
                            }}
                            placeholder="Enter Extra price for this option"
                            className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] placeholder:text-[#999] outline-none mt-2"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const newVariants = [...formData.variants];
                          newVariants[vIdx].options = newVariants[vIdx].options.filter((_, i) => i !== oIdx);
                          updateField('variants', newVariants);
                        }}
                        className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const newVariants = [...formData.variants];
                      newVariants[vIdx].options.push({ attribute: '', extraPrice: 0 });
                      updateField('variants', newVariants);
                    }}
                    className="mt-4 h-10 bg-gradient-to-r from-[#38bdf8] to-[#1e90ff] text-white rounded-lg px-4 flex items-center gap-3"
                  >
                    <AddCircleIcon />
                    <span className="text-[14px] font-semibold">Add More Option</span>
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  updateField('variants', [...formData.variants, { title: '', options: [{ attribute: '', extraPrice: 0 }] }]);
                }}
                className="h-10 bg-[#f4f4f4] rounded-lg px-4 flex items-center gap-3"
              >
                <Plus size={24} />
                <span className="text-[14px] font-semibold text-black">Add a new variant</span>
              </button>
            </div>
          </Section>

          {/* Brand */}
          <Section title="Brand" subtitle="You can add multiple product details for a single product here. Like Brand, Model, Serial Number, Fabric Type, and EMI etc.">
            <div className="flex items-end gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <InputField
                  label="Brand Name"
                  value={formData.brandName}
                  onChange={(v) => updateField('brandName', v)}
                  placeholder="Samsung"
                />
                <InputField
                  label="Model Name"
                  value={formData.modelName}
                  onChange={(v) => updateField('modelName', v)}
                  placeholder="S25 Ultra"
                />
              </div>
              <button className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                <X size={24} />
              </button>
            </div>
            <button className="mt-4 h-10 bg-[#f4f4f4] rounded-lg px-4 flex items-center gap-3">
              <Plus size={24} />
              <span className="text-[14px] font-semibold text-black">Create a new Brand</span>
            </button>
          </Section>

          {/* Product Details */}
          <Section title="key features" subtitle="You can add multiple key features for a single product here. Like Brand, Model, Serial Number, Fabric Type, and EMI etc.">
            {formData.details.map((detail, idx) => (
              <div key={idx} className="flex items-end gap-2 mb-4">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <InputField
                    label="Detail Type"
                    value={detail.type}
                    onChange={(v) => {
                      const newDetails = [...formData.details];
                      newDetails[idx].type = v;
                      updateField('details', newDetails);
                    }}
                    placeholder="Ram"
                  />
                  <InputField
                    label="Detail Description"
                    value={detail.description}
                    onChange={(v) => {
                      const newDetails = [...formData.details];
                      newDetails[idx].description = v;
                      updateField('details', newDetails);
                    }}
                    placeholder="16 GB"
                  />
                </div>
                <button 
                  onClick={() => updateField('details', formData.details.filter((_, i) => i !== idx))}
                  className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500"
                >
                  <X size={24} />
                </button>
              </div>
            ))}
            <button
              onClick={() => updateField('details', [...formData.details, { type: '', description: '' }])}
              className="h-10 bg-[#f4f4f4] rounded-lg px-4 flex items-center gap-3"
            >
              <Plus size={24} />
              <span className="text-[14px] font-semibold text-black">Add More</span>
            </button>
          </Section>

          {/* Affiliate */}
          <Section title="Affiliate">
            <div className="space-y-4">
              <SelectField
                label="Product Source (Optional)"
                value={formData.affiliateSource}
                onChange={(v) => updateField('affiliateSource', v)}
                options={affiliateSources}
                placeholder="Select source"
              />
              <p className="text-[12px] text-[#a2a2a2]">Select if this product is sourced from an external supplier or marketplace</p>

              {formData.affiliateSource && (
                <>
                  <div className="bg-[#fff8ef] h-[60px] rounded-lg flex items-center px-4 gap-4">
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center text-orange-500 font-bold">A</div>
                    <div>
                      <p className="text-[14px] font-bold text-black">{formData.affiliateSource}</p>
                      <p className="text-[10px] text-[#009ade]">www.{formData.affiliateSource.toLowerCase()}.com</p>
                    </div>
                    <span className="ml-auto bg-[#ff821c] text-white text-[12px] font-semibold px-3 py-1 rounded-full">Marketplace</span>
                  </div>

                  <div className="bg-[#fff8ef] rounded-lg p-4 sm:p-6 space-y-4">
                    <p className="text-[14px] font-bold text-black">Source Product Details (Optional)</p>
                    <div>
                      <InputField
                        label="Source Product URL"
                        value={formData.sourceProductUrl}
                        onChange={(v) => updateField('sourceProductUrl', v)}
                        placeholder="www.xyz.com/product/123"
                      />
                      <p className="text-[12px] text-[#a2a2a2] mt-1">Direct link to this product on the source platform</p>
                    </div>
                    <div>
                      <InputField
                        label="Source SKU / Product Code"
                        value={formData.sourceSku}
                        onChange={(v) => updateField('sourceSku', v)}
                        placeholder="ABC-XYZ-123"
                      />
                      <p className="text-[12px] text-[#a2a2a2] mt-1">Product identifier from the source (SKU, Product ID, etc.)</p>
                    </div>
                    <div className="bg-[#fff0dd] rounded-lg p-3">
                      <p className="text-[12px] text-[#a2a2a2]">
                        💡 Tip: These details help you track and manage products from external sources. You can use the Source URL to quickly access the product page, and the Source SKU for ordering or communication with suppliers.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* Shipping */}
          <Section title="Shipping">
            <div className="space-y-4">
              <div>
                <p className="text-[20px] font-medium">Delivery Charge</p>
                <p className="text-[12px] text-[#a2a2a2]">You can add specific delivery charge for this product or use the default charges</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[16px]">Apply default delivery charges</span>
                <Toggle 
                  label={formData.useDefaultDelivery ? "[Applied]" : "[Not Applied]"}
                  value={formData.useDefaultDelivery}
                  onChange={(v) => updateField('useDefaultDelivery', v)}
                />
              </div>

              <InputField
                label="Delivery Charge (Default)"
                value={formData.deliveryChargeDefault}
                onChange={(v) => updateField('deliveryChargeDefault', parseFloat(v) || 0)}
                placeholder="120"
                type="number"
              />

              <div>
                <label className="text-[16px] text-black">Specific Delivery Charge</label>
                <div className="flex gap-2 mt-2">
                  <input
                    value={formData.deliveryByCity[0]?.city || ''}
                    onChange={(e) => {
                      const newDelivery = [...formData.deliveryByCity];
                      if (newDelivery[0]) newDelivery[0].city = e.target.value;
                      else newDelivery.push({ city: e.target.value, charge: 0 });
                      updateField('deliveryByCity', newDelivery);
                    }}
                    placeholder="Dhaka"
                    className="flex-1 h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] outline-none"
                  />
                  <input
                    type="number"
                    value={formData.deliveryByCity[0]?.charge || ''}
                    onChange={(e) => {
                      const newDelivery = [...formData.deliveryByCity];
                      if (newDelivery[0]) newDelivery[0].charge = parseFloat(e.target.value) || 0;
                      else newDelivery.push({ city: '', charge: parseFloat(e.target.value) || 0 });
                      updateField('deliveryByCity', newDelivery);
                    }}
                    placeholder="80"
                    className="w-full sm:w-[213px] h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] outline-none"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* SEO Info */}
          <Section title="SEO Info">
            <div className="space-y-4">
              <InputField
                label="Keyword"
                value={formData.keywords}
                onChange={(v) => updateField('keywords', v)}
                placeholder="Seo Keyword"
              />
              <InputField
                label="SEO Description"
                value={formData.seoDescription}
                onChange={(v) => updateField('seoDescription', v)}
                placeholder="Seo Description"
              />
              <InputField
                label="SEO Title"
                value={formData.seoTitle}
                onChange={(v) => updateField('seoTitle', v)}
                placeholder="Seo Title"
              />
            </div>
          </Section>
        </div>

        {/* Right Sidebar - Desktop only */}
        <div className="hidden lg:block w-[320px] lg:w-[381px] flex-shrink-0 space-y-4 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              className="flex-1 h-10 bg-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <DraftIcon />
              <span className="text-[14px] font-semibold text-[#070606]">Draft</span>
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 h-10 bg-gradient-to-r from-[#38bdf8] to-[#1e90ff] rounded-lg flex items-center justify-center gap-2"
            >
              <AddCircleIcon />
              <span className="text-[14px] font-semibold text-white">{editProduct ? 'Update' : 'Add Product'}</span>
            </button>
          </div>

          {/* Ready To Publish */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Ready To Publish</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-[#f9f9f9] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor(completionPercentage)} rounded-full transition-all duration-300`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-[14px] font-medium">{completionPercentage}%</span>
            </div>
            <div className="space-y-2">
              {completionItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                    {item.completed && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[12px] font-medium ${item.completed ? 'text-black' : 'text-gray-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Catalog</h3>
            
            {/* Categories - Multi-select chips */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Assign categories <span className="text-red-500">*</span></label>
                <button
                  type="button"
                  onClick={() => { setCatalogModalTab('category'); setShowCatalogModal(true); }}
                  className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localCategories.map(cat => {
                  const isSelected = (formData.categories || []).includes(cat.name);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        const arr = formData.categories || [];
                        const newArr = isSelected ? arr.filter((c: string) => c !== cat.name) : [...arr, cat.name];
                        updateField('categories', newArr);
                        updateField('category', newArr[0] || '');
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        isSelected ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                      }`}
                    >
                      {isSelected && <span className="mr-1">✓</span>}{cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub Categories - Multi-select chips */}
            {localSubCategories.filter(sc => {
              const selCats = formData.categories || [];
              return selCats.length === 0 || selCats.some((cat: string) => sc.categoryName === cat || sc.categoryId === cat || localCategories.find(c => c.name === cat)?.id === sc.categoryId);
            }).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Assign sub categories</label>
                  <button
                    type="button"
                    onClick={() => { setCatalogModalTab('subcategory'); setShowCatalogModal(true); }}
                    className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localSubCategories.filter(sc => {
                    const selCats = formData.categories || [];
                    return selCats.length === 0 || selCats.some((cat: string) => sc.categoryName === cat || sc.categoryId === cat || localCategories.find(c => c.name === cat)?.id === sc.categoryId);
                  }).map(sc => {
                    const isSelected = (formData.subCategoriesArr || []).includes(sc.name);
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => {
                          const arr = formData.subCategoriesArr || [];
                          const newArr = isSelected ? arr.filter((s: string) => s !== sc.name) : [...arr, sc.name];
                          updateField('subCategoriesArr', newArr);
                          updateField('subCategory', newArr[0] || '');
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                          isSelected ? 'bg-purple-500 text-white border-purple-500 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}{sc.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Child Categories - Multi-select chips */}
            {localChildCategories.filter(cc => {
              const selSubs = formData.subCategoriesArr || [];
              return selSubs.length === 0 ? false : selSubs.some((sub: string) => cc.subCategoryId === sub || cc.subCategoryId === sub || localSubCategories.find(s => s.name === sub)?.id === cc.subCategoryId);
            }).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Assign child categories</label>
                  <button
                    type="button"
                    onClick={() => { setCatalogModalTab('childcategory'); setShowCatalogModal(true); }}
                    className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localChildCategories.filter(cc => {
                    const selSubs = formData.subCategoriesArr || [];
                    return selSubs.some((sub: string) => cc.subCategoryId === sub || cc.subCategoryId === sub || localSubCategories.find(s => s.name === sub)?.id === cc.subCategoryId);
                  }).map(cc => {
                    const isSelected = (formData.childCategoriesArr || []).includes(cc.name);
                    return (
                      <button
                        key={cc.id}
                        type="button"
                        onClick={() => {
                          const arr = formData.childCategoriesArr || [];
                          const newArr = isSelected ? arr.filter((c: string) => c !== cc.name) : [...arr, cc.name];
                          updateField('childCategoriesArr', newArr);
                          updateField('childCategory', newArr[0] || '');
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                          isSelected ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}{cc.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brands - Multi-select chips */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Assign brands</label>
                <button
                  type="button"
                  onClick={() => { setCatalogModalTab('brand'); setShowCatalogModal(true); }}
                  className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localBrands.map(b => {
                  const isSelected = (formData.brandsArr || []).includes(b.name);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        const arr = formData.brandsArr || [];
                        const newArr = isSelected ? arr.filter((x: string) => x !== b.name) : [...arr, b.name];
                        updateField('brandsArr', newArr);
                        updateField('brandName', newArr[0] || '');
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        isSelected ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                      }`}
                    >
                      {isSelected && <span className="mr-1">✓</span>}{b.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Flash Sale', 'New Arrival', 'Most Popular'].map((tagName) => {
                  const tagArr = Array.isArray(formData.tag) ? formData.tag : [];
                  const isSelected = tagArr.includes(tagName);
                  return (
                    <button
                      key={tagName}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          updateField('tag', tagArr.filter((t: string) => t !== tagName));
                        } else {
                          updateField('tag', [...tagArr, tagName]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        isSelected
                          ? tagName === 'Flash Sale'
                            ? 'bg-red-500 text-white border-red-500 shadow-md'
                            : tagName === 'New Arrival'
                            ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                            : 'bg-purple-500 text-white border-purple-500 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {isSelected ? '\u2713 ' : ''}{tagName}
                    </button>
                  );
                })}
              </div>
              {/* Custom Tags */}
              <SelectField
                value=""
                onChange={(v) => {
                  const tArr = Array.isArray(formData.tag) ? formData.tag : [];
                  if (v && !tArr.includes(v)) {
                    updateField('tag', [...tArr, v]);
                  }
                }}
                options={(localTags || []).filter(t => !['Flash Sale', 'New Arrival', 'Most Popular'].includes(t.name)).map(t => ({ value: t.name, label: t.name }))}
                placeholder="Add custom tag..."
              />
              {(Array.isArray(formData.tag) ? formData.tag : []).filter((t: string) => !['Flash Sale', 'New Arrival', 'Most Popular'].includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(Array.isArray(formData.tag) ? formData.tag : []).filter((t: string) => !['Flash Sale', 'New Arrival', 'Most Popular'].includes(t)).map((t: string) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {t}
                      <button type="button" onClick={() => updateField('tag', (Array.isArray(formData.tag) ? formData.tag : []).filter((x: string) => x !== t))} className="text-gray-400 hover:text-red-500">\u00d7</button>
                    </span>
                  ))}
                </div>
              )}
              {/* <button 
                onClick={() => { setCatalogModalTab('tag'); setShowCatalogModal(true); }}
                className="mt-2 h-9 bg-[#f4f4f4] rounded-lg px-3 flex items-center gap-2 ml-auto hover:bg-gray-200 transition-colors text-sm"
              >
                <Plus size={18} />
                <span className="font-semibold text-[#070606]">Add Tag</span>
              </button> */}
            </div>
          </div>

          {/* Deep Search */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Deep Search</h3>
            <input
              value={formData.deepSearch}
              onChange={(e) => updateField('deepSearch', e.target.value)}
              type="text"
              placeholder="Keywords comma দিয়ে আলাদা করুন (ex: mobile, phone, samsung)"
              className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[12px] placeholder:text-[#a2a2a2] outline-none"
            />
          </div>

          {/* Condition */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Condition</h3>
            <SelectField
              value={formData.condition}
              onChange={(v) => updateField('condition', v)}
              options={[
                { value: 'New', label: 'New' },
                { value: 'Used', label: 'Used' },
                { value: 'Refurbished', label: 'Refurbished' }
              ]}
              placeholder="Select Condition"
            />
          </div>

          {/* Flash Sale */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Flash Sale</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Enable Flash Sale</span>
              <button
                type="button"
                onClick={() => updateField('flashSale', !formData.flashSale)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.flashSale ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.flashSale ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {formData.flashSale && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
                  <input type="datetime-local" value={formData.flashSaleStartDate} onChange={(e) => updateField('flashSaleStartDate', e.target.value)} className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">End Date</label>
                  <input type="datetime-local" value={formData.flashSaleEndDate} onChange={(e) => updateField('flashSaleEndDate', e.target.value)} className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* Most Sales */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Most Sales</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mark as Most Sales</span>
              <button
                type="button"
                onClick={() => updateField('isMostSales', !formData.isMostSales)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(formData as any).isMostSales ? 'bg-amber-500' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(formData as any).isMostSales ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - shown below form on mobile */}
        <div className="lg:hidden space-y-3 xxs:space-y-4 w-full">
          {/* Flash Sale */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Flash Sale</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Enable Flash Sale</span>
              <button
                type="button"
                onClick={() => updateField('flashSale', !formData.flashSale)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.flashSale ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.flashSale ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {formData.flashSale && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
                  <input type="datetime-local" value={formData.flashSaleStartDate} onChange={(e) => updateField('flashSaleStartDate', e.target.value)} className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">End Date</label>
                  <input type="datetime-local" value={formData.flashSaleEndDate} onChange={(e) => updateField('flashSaleEndDate', e.target.value)} className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] outline-none" />
                </div>
              </div>
            )}
          </div>
          {/* Action Buttons - Mobile */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              className="flex-1 h-9 xxs:h-10 bg-white rounded-lg flex items-center justify-center gap-1.5 xxs:gap-2 hover:bg-gray-50 text-xs xxs:text-sm"
            >
              <DraftIcon />
              <span className="font-semibold text-[#070606]">Draft</span>
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 h-9 xxs:h-10 bg-gradient-to-r from-[#38bdf8] to-[#1e90ff] rounded-lg flex items-center justify-center gap-1.5 xxs:gap-2"
            >
              <AddCircleIcon />
              <span className="text-xs xxs:text-sm font-semibold text-white">{editProduct ? 'Update' : 'Add'}</span>
            </button>
          </div>

          {/* Ready To Publish - Mobile */}
          <div className="bg-white rounded-lg p-2 xxs:p-3 sm:p-4">
            <h3 className="text-sm xxs:text-base sm:text-lg font-medium text-black mb-2 xxs:mb-3">Ready To Publish</h3>
            <div className="flex items-center gap-2 mb-2 xxs:mb-3">
              <div className="flex-1 h-1.5 xxs:h-2 bg-[#f9f9f9] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor(completionPercentage)} rounded-full transition-all duration-300`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs xxs:text-sm font-medium">{completionPercentage}%</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 xxs:gap-2">
              {completionItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 xxs:gap-2">
                  <div className={`w-2.5 h-2.5 xxs:w-3 xxs:h-3 rounded-full border flex items-center justify-center transition-all ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                    {item.completed && (
                      <svg className="w-1.5 h-1.5 xxs:w-2 xxs:h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[10px] xxs:text-xs ${item.completed ? 'text-black' : 'text-gray-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog - Mobile */}
          <div className="bg-white rounded-lg p-2 xxs:p-3 sm:p-4">
            <h3 className="text-sm xxs:text-base sm:text-lg font-medium text-black mb-2 xxs:mb-3">Catalog</h3>
            
            {/* Categories - Mobile chips */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-700">Assign categories <span className="text-red-500">*</span></label>
                <button type="button" onClick={() => { setCatalogModalTab('category'); setShowCatalogModal(true); }} className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center"><Plus size={12} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {localCategories.map(cat => {
                  const isSelected = (formData.categories || []).includes(cat.name);
                  return (
                    <button key={cat.id} type="button" onClick={() => { const arr = formData.categories || []; const newArr = isSelected ? arr.filter((c: string) => c !== cat.name) : [...arr, cat.name]; updateField('categories', newArr); updateField('category', newArr[0] || ''); }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${isSelected ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300'}`}
                    >{isSelected && '✓ '}{cat.name}</button>
                  );
                })}
              </div>
            </div>

            {/* Sub Categories - Mobile chips */}
            {localSubCategories.filter(sc => { const selCats = formData.categories || []; return selCats.length === 0 || selCats.some((cat: string) => sc.categoryName === cat || sc.categoryId === cat || localCategories.find(c => c.name === cat)?.id === sc.categoryId); }).length > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Assign sub categories</label>
                  <button type="button" onClick={() => { setCatalogModalTab('subcategory'); setShowCatalogModal(true); }} className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center"><Plus size={12} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {localSubCategories.filter(sc => { const selCats = formData.categories || []; return selCats.length === 0 || selCats.some((cat: string) => sc.categoryName === cat || sc.categoryId === cat || localCategories.find(c => c.name === cat)?.id === sc.categoryId); }).map(sc => {
                    const isSelected = (formData.subCategoriesArr || []).includes(sc.name);
                    return (
                      <button key={sc.id} type="button" onClick={() => { const arr = formData.subCategoriesArr || []; const newArr = isSelected ? arr.filter((s: string) => s !== sc.name) : [...arr, sc.name]; updateField('subCategoriesArr', newArr); updateField('subCategory', newArr[0] || ''); }}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300'}`}
                      >{isSelected && '✓ '}{sc.name}</button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Child Categories - Mobile chips */}
            {localChildCategories.filter(cc => { const selSubs = formData.subCategoriesArr || []; return selSubs.length === 0 ? false : selSubs.some((sub: string) => cc.subCategoryId === sub || cc.subCategoryId === sub || localSubCategories.find(s => s.name === sub)?.id === cc.subCategoryId); }).length > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Assign child categories</label>
                  <button type="button" onClick={() => { setCatalogModalTab('childcategory'); setShowCatalogModal(true); }} className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Plus size={12} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {localChildCategories.filter(cc => { const selSubs = formData.subCategoriesArr || []; return selSubs.some((sub: string) => cc.subCategoryId === sub || cc.subCategoryId === sub || localSubCategories.find(s => s.name === sub)?.id === cc.subCategoryId); }).map(cc => {
                    const isSelected = (formData.childCategoriesArr || []).includes(cc.name);
                    return (
                      <button key={cc.id} type="button" onClick={() => { const arr = formData.childCategoriesArr || []; const newArr = isSelected ? arr.filter((c: string) => c !== cc.name) : [...arr, cc.name]; updateField('childCategoriesArr', newArr); updateField('childCategory', newArr[0] || ''); }}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${isSelected ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-700 border-gray-300'}`}
                      >{isSelected && '✓ '}{cc.name}</button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brands - Mobile chips */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-700">Assign brands</label>
                <button type="button" onClick={() => { setCatalogModalTab('brand'); setShowCatalogModal(true); }} className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center"><Plus size={12} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {localBrands.map(b => {
                  const isSelected = (formData.brandsArr || []).includes(b.name);
                  return (
                    <button key={b.id} type="button" onClick={() => { const arr = formData.brandsArr || []; const newArr = isSelected ? arr.filter((x: string) => x !== b.name) : [...arr, b.name]; updateField('brandsArr', newArr); updateField('brandName', newArr[0] || ''); }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${isSelected ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-300'}`}
                    >{isSelected && '✓ '}{b.name}</button>
                  );
                })}
              </div>
            </div>

            {/* Product Tags - Mobile */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {['Flash Sale', 'New Arrival', 'Most Popular'].map((tagName) => {
                  const isSelected = formData.tag.includes(tagName);
                  return (
                    <button
                      key={tagName}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          updateField('tag', formData.tag.filter((t: string) => t !== tagName));
                        } else {
                          updateField('tag', [...formData.tag, tagName]);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                        isSelected
                          ? tagName === 'Flash Sale'
                            ? 'bg-red-500 text-white border-red-500'
                            : tagName === 'New Arrival'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-purple-500 text-white border-purple-500'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {isSelected ? '\u2713 ' : ''}{tagName}
                    </button>
                  );
                })}
              </div>
              {/* Custom Tags Mobile */}
              <SelectField
                value=""
                onChange={(v) => {
                  const tArr = Array.isArray(formData.tag) ? formData.tag : [];
                  if (v && !tArr.includes(v)) {
                    updateField('tag', [...tArr, v]);
                  }
                }}
                options={(localTags || []).filter(t => !['Flash Sale', 'New Arrival', 'Most Popular'].includes(t.name)).map(t => ({ value: t.name, label: t.name }))}
                placeholder="Add custom tag..."
              />
              {formData.tag.filter((t: string) => !['Flash Sale', 'New Arrival', 'Most Popular'].includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {formData.tag.filter((t: string) => !['Flash Sale', 'New Arrival', 'Most Popular'].includes(t)).map((t: string) => (
                    <span key={t} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                      {t}
                      <button type="button" onClick={() => updateField('tag', formData.tag.filter((x: string) => x !== t))} className="text-gray-400 hover:text-red-500">\u00d7</button>
                    </span>
                  ))}
                </div>
              )}
              {/* <button 
                onClick={() => { setCatalogModalTab('tag'); setShowCatalogModal(true); }}
                className="mt-1.5 h-7 xxs:h-8 bg-[#f4f4f4] rounded-lg px-2 flex items-center gap-1 ml-auto hover:bg-gray-200 transition-colors text-xs"
              >
                <Plus size={14} />
                <span className="font-semibold text-[#070606]">Add Tag</span>
              </button> */}
            </div>
          </div>

          {/* Deep Search - Mobile */}
          <div className="bg-white rounded-lg p-2 xxs:p-3 sm:p-4">
            <h3 className="text-sm xxs:text-base sm:text-lg font-medium text-black mb-2 xxs:mb-3">Deep Search</h3>
            <input
              value={formData.deepSearch}
              onChange={(e) => updateField('deepSearch', e.target.value)}
              type="text"
              placeholder="Keywords comma দিয়ে আলাদা করুন (ex: mobile, phone, samsung)"
              className="w-full h-9 bg-[#f9f9f9] rounded-lg px-3 text-xs placeholder:text-[#a2a2a2] outline-none"
            />
          </div>

          {/* Condition - Mobile */}
          <div className="bg-white rounded-lg p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-medium text-black mb-3">Condition</h3>
            <SelectField
              value={formData.condition}
              onChange={(v) => updateField('condition', v)}
              options={[
                { value: 'New', label: 'New' },
                { value: 'Used', label: 'Used' },
                { value: 'Refurbished', label: 'Refurbished' }
              ]}
              placeholder="Select Condition"
            />
          </div>
        </div>
      </div>

      {/* Add Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[95vw] sm:w-[600px] max-w-[600px] max-h-[90vh] overflow-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Add Catalog Item</h2>
              <button 
                onClick={() => setShowCatalogModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b overflow-x-auto">
              {[
                { key: 'category', label: 'Category' },
                { key: 'subcategory', label: 'Sub Category' },
                { key: 'childcategory', label: 'Child Category' },
                { key: 'brand', label: 'Brand' },
                { key: 'tag', label: 'Tag' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setCatalogModalTab(tab.key as any);
                    setNewCatalogItem({ name: '', parentCategory: '', parentSubCategory: '', image: '', isFlashSale: false, isMostSales: false, durationDays: 0 });
                  }}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    catalogModalTab === tab.key 
                      ? 'text-[#ff6a00] border-b-2 border-[#ff6a00]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name Input - Common for all */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {catalogModalTab === 'category' ? 'Category' : 
                   catalogModalTab === 'subcategory' ? 'Sub Category' :
                   catalogModalTab === 'childcategory' ? 'Child Category' :
                   catalogModalTab === 'brand' ? 'Brand' : 'Tag'} Name *
                </label>
                <input
                  type="text"
                  value={newCatalogItem.name}
                  onChange={(e) => setNewCatalogItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`Enter ${catalogModalTab} name`}
                  className="w-full h-11 border rounded-lg px-3 text-sm outline-none focus:border-[#ff6a00]"
                />
              </div>

              {/* Parent Category - for Sub Category */}
              {catalogModalTab === 'subcategory' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category *</label>
                  <select
                    value={newCatalogItem.parentCategory}
                    onChange={(e) => setNewCatalogItem(prev => ({ ...prev, parentCategory: e.target.value }))}
                    className="w-full h-11 border rounded-lg px-3 text-sm outline-none focus:border-[#ff6a00] bg-white"
                  >
                    <option value="">Select Parent Category</option>
                    {localCategories.map((cat) => (
                      <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Parent Sub Category - for Child Category */}
              {catalogModalTab === 'childcategory' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Sub Category *</label>
                  <select
                    value={newCatalogItem.parentSubCategory}
                    onChange={(e) => setNewCatalogItem(prev => ({ ...prev, parentSubCategory: e.target.value }))}
                    className="w-full h-11 border rounded-lg px-3 text-sm outline-none focus:border-[#ff6a00] bg-white"
                  >
                    <option value="">Select Parent Sub Category</option>
                    {localSubCategories.map((sub) => (
                      <option key={sub.id || sub.name} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Image Upload - for Category and Brand */}
              {(catalogModalTab === 'category' || catalogModalTab === 'brand') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {catalogModalTab === 'brand' ? 'Brand Logo' : 'Category Icon/Image'} (Optional)
                  </label>
                  <input
                    ref={catalogImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCatalogImageUpload(file);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => catalogImageRef.current?.click()}
                      className={`w-20 h-20 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                        newCatalogItem.image ? 'border-[#ff6a00] bg-orange-50' : 'border-gray-300 hover:border-[#ff6a00] bg-gray-50'
                      }`}
                    >
                      {uploadingCatalogImage ? (
                        <div className="animate-spin w-6 h-6 border-2 border-[#ff6a00] border-t-transparent rounded-full" />
                      ) : newCatalogItem.image ? (
                        <img src={normalizeImageUrl(newCatalogItem.image)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <Upload size={24} />
                          <span className="text-xs mt-1">Upload</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openGalleryPicker('catalogIcon')}
                      className="h-20 px-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6a00] hover:bg-orange-50 transition-colors text-gray-400"
                    >
                      <FolderOpen size={24} />
                      <span className="text-xs mt-1">Gallery</span>
                    </button>
                    {newCatalogItem.image && (
                      <button
                        onClick={() => setNewCatalogItem(prev => ({ ...prev, image: '' }))}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <X size={14} /> Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square image, 200x200px or larger
                  </p>
                </div>
              )}

              {/* Image Upload - for Sub Category */}
              {catalogModalTab === 'subcategory' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category Icon (Optional)
                  </label>
                  <input
                    ref={catalogImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCatalogImageUpload(file);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => catalogImageRef.current?.click()}
                      className={`w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                        newCatalogItem.image ? 'border-[#ff6a00] bg-orange-50' : 'border-gray-300 hover:border-[#ff6a00] bg-gray-50'
                      }`}
                    >
                      {uploadingCatalogImage ? (
                        <div className="animate-spin w-5 h-5 border-2 border-[#ff6a00] border-t-transparent rounded-full" />
                      ) : newCatalogItem.image ? (
                        <img src={normalizeImageUrl(newCatalogItem.image)} alt="Preview" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <Upload size={20} className="text-gray-400" />
                      )}
                    </div>
                    {newCatalogItem.image && (
                      <button
                        onClick={() => setNewCatalogItem(prev => ({ ...prev, image: '' }))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Image Upload - for Child Category */}
              {catalogModalTab === 'childcategory' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child Category Icon (Optional)
                  </label>
                  <input
                    ref={catalogImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCatalogImageUpload(file);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => catalogImageRef.current?.click()}
                      className={`w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                        newCatalogItem.image ? 'border-[#ff6a00] bg-orange-50' : 'border-gray-300 hover:border-[#ff6a00] bg-gray-50'
                      }`}
                    >
                      {uploadingCatalogImage ? (
                        <div className="animate-spin w-5 h-5 border-2 border-[#ff6a00] border-t-transparent rounded-full" />
                      ) : newCatalogItem.image ? (
                        <img src={normalizeImageUrl(newCatalogItem.image)} alt="Preview" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <Upload size={20} className="text-gray-400" />
                      )}
                    </div>
                    {newCatalogItem.image && (
                      <button
                        onClick={() => setNewCatalogItem(prev => ({ ...prev, image: '' }))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Image Upload - for Tag */}
              {catalogModalTab === 'tag' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Icon (Optional)
                  </label>
                  <input
                    ref={catalogImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCatalogImageUpload(file);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => catalogImageRef.current?.click()}
                      className={`w-14 h-14 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                        newCatalogItem.image ? 'border-[#ff6a00] bg-orange-50' : 'border-gray-300 hover:border-[#ff6a00] bg-gray-50'
                      }`}
                    >
                      {uploadingCatalogImage ? (
                        <div className="animate-spin w-4 h-4 border-2 border-[#ff6a00] border-t-transparent rounded-full" />
                      ) : newCatalogItem.image ? (
                        <img src={normalizeImageUrl(newCatalogItem.image)} alt="Preview" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <Upload size={18} className="text-gray-400" />
                      )}
                    </div>
                    {newCatalogItem.image && (
                      <button
                        onClick={() => setNewCatalogItem(prev => ({ ...prev, image: '' }))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tag Duration - for Tag */}
              {catalogModalTab === 'tag' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Days)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Set how many days this tag will stay active in the store. Leave 0 for permanent.
                  </p>
                  <input
                    type="number"
                    min="0"
                    value={newCatalogItem.durationDays || ''}
                    onChange={(e) => setNewCatalogItem(prev => ({ ...prev, durationDays: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g. 7 for one week"
                    className="w-full h-11 border rounded-lg px-3 text-sm outline-none focus:border-[#ff6a00]"
                  />
                  {newCatalogItem.durationDays > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Tag will expire on: {new Date(Date.now() + newCatalogItem.durationDays * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
              )}

              {/* Flash Sale & Most Sales - for Category */}
              {catalogModalTab === 'category' && (
                <div className="flex gap-3 sm:gap-4 lg:gap-4 xl:gap-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCatalogItem.isFlashSale}
                      onChange={(e) => setNewCatalogItem(prev => ({ ...prev, isFlashSale: e.target.checked }))}
                      className="w-4 h-4 accent-[#ff6a00]"
                    />
                    <span className="text-sm text-gray-700">⚡ Flash Sale Category</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCatalogItem.isMostSales}
                      onChange={(e) => setNewCatalogItem(prev => ({ ...prev, isMostSales: e.target.checked }))}
                      className="w-4 h-4 accent-[#ff6a00]"
                    />
                    <span className="text-sm text-gray-700">🔥 Most Sales Category</span>
                  </label>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowCatalogModal(false)}
                className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCatalogItem}
                disabled={savingCatalog}
                className="px-5 py-2.5 text-sm bg-[#ff6a00] text-white rounded-lg hover:bg-[#e55d00] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {savingCatalog && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {savingCatalog ? 'Saving...' : `Add ${catalogModalTab.charAt(0).toUpperCase() + catalogModalTab.slice(1)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Picker Modal */}
      <GalleryPicker
        isOpen={showGalleryPicker}
        onClose={() => {
          setShowGalleryPicker(false);
          setGalleryPickerTarget(null);
          setGalleryPickerVariantKey(null);
        }}
        onSelect={handleGallerySelect}
        multiple={galleryPickerTarget === 'gallery'}
        onSelectMultiple={galleryPickerTarget === 'gallery' ? handleGallerySelectMultiple : undefined}
        title={
          galleryPickerTarget === 'mainImage' ? 'Select Main Image' :
          galleryPickerTarget === 'gallery' ? 'Select Gallery Images' :
          galleryPickerTarget === 'variantImage' ? 'Select Variant Image' :
          'Select Image'
        }
      />
    </div>
  );
};

export default FigmaProductUpload;
