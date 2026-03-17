export type ProductImageGalleryProps = {
  variant: "single" | "gallery";
  mainImageSrc: string;
  mainImageAlt: string;
  discountLabel?: string;
  iconSrc?: string;
  galleryImages?: { src: string; alt: string }[];
  outerClassVariant: string;
  innerContainerClass: string;
  selectedImageIndex?: number;
  onThumbnailHover?: (index: number) => void;
  onThumbnailClick?: (index: number) => void;
  onMainImageClick?: () => void;
};

export const ProductImageGallery = (props: ProductImageGalleryProps) => {
  if (props.variant === "single") {
    return (
      <div
        className={`group/zoom cursor-zoom-in ${props.outerClassVariant}`}
        onClick={props.onMainImageClick}
      >
        <div
          className={`box-content caret-black md:aspect-auto md:box-border md:caret-transparent md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] overflow-hidden ${props.innerContainerClass}`}
        >
          <img
            alt={props.mainImageAlt}
            src={props.mainImageSrc}
            className="box-content caret-black block h-auto max-h-none object-fill align-middle w-auto rounded-none transition-transform duration-300 group-hover/zoom:scale-125 md:aspect-auto md:box-border md:caret-transparent md:inline md:h-full md:max-h-[330px] md:object-contain md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:align-baseline md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[15px]"
          />
        </div>
        {/* Zoom icon overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-200 pointer-events-none rounded-[15px]">
          <div className="bg-black/40 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-6-3v6m-3-3h6" />
            </svg>
          </div>
        </div>
        <div className=" absolute text-green-500 text-[11px] font-extrabold bg-green-100 box-border caret-transparent px-2 py-1 rounded-[5px] left-2.5 top-2.5">
          <span className="box-border caret-transparent">
            {props.discountLabel}
          </span>
        </div>
        <button className="absolute text-white text-[13.3333px] bg-transparent caret-transparent block text-center p-0 right-[30px] top-2.5 font-arial" onClick={(e) => e.stopPropagation()}>
          <span className="relative font-medium box-border caret-transparent flex">
            <img
              src={props.iconSrc}
              alt="Icon"
              className="box-border caret-transparent h-5 align-baseline w-6"
            />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={` ${props.outerClassVariant}`}>
      <div
        className={`box-content caret-black md:aspect-auto md:box-border md:caret-transparent md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.innerContainerClass}`}
      >
        {props.galleryImages &&
          props.galleryImages.map((image, index) => (
            <div
              key={index}
              onMouseEnter={() => props.onThumbnailHover?.(index)}
              onClick={() => props.onThumbnailClick?.(index)}
              className={`cursor-pointer flex-shrink-0 w-[75px] h-[75px] overflow-hidden rounded-[10px] border-2 transition-all duration-150 ${
                props.selectedImageIndex === index
                  ? 'border-indigo-600'
                  : 'border-indigo-600/20 hover:border-indigo-400'
              }`}
            >
              <img
                alt={image.alt}
                src={image.src}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
      </div>
    </div>
  );
};
