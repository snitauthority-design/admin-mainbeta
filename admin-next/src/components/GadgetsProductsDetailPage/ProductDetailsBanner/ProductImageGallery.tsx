export type ProductImageGalleryProps = {
  variant: "single" | "gallery";
  mainImageSrc: string;
  mainImageAlt: string;
  discountLabel?: string;
  iconSrc?: string;
  galleryImages?: { src: string; alt: string }[];
  outerClassVariant: string;
  innerContainerClass: string;
};

export const ProductImageGallery = (props: ProductImageGalleryProps) => {
  if (props.variant === "single") {
    return (
      <div className={` ${props.outerClassVariant}`}>
        <div
          className={`box-content caret-black md:aspect-auto md:box-border md:caret-transparent md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.innerContainerClass}`}
        >
          <img
            alt={props.mainImageAlt}
            src={props.mainImageSrc}
            className="box-content caret-black block h-auto max-h-none object-fill align-middle w-auto rounded-none md:aspect-auto md:box-border md:caret-transparent md:inline md:h-full md:max-h-[330px] md:object-contain md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:align-baseline md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[15px]"
          />
        </div>
        <div className=" absolute text-green-500 text-[11px] font-extrabold bg-green-100 box-border caret-transparent px-2 py-1 rounded-[5px] left-2.5 top-2.5">
          <span className="box-border caret-transparent">
            {props.discountLabel}
          </span>
        </div>
        <button className="absolute text-white text-[13.3333px] bg-transparent caret-transparent block text-center p-0 right-[30px] top-2.5 font-arial">
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
              className={
                index === 0
                  ? "box-content caret-black block min-h-0 min-w-0 rounded-none md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-indigo-600 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[17px] md:border-solid"
                  : "box-content caret-black block min-h-0 min-w-0 rounded-none md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-indigo-600/20 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[17px] md:border-solid"
              }
            >
              <img
                alt={image.alt}
                src={image.src}
                className="box-content caret-black h-auto max-h-none max-w-none min-h-0 min-w-0 object-fill align-middle w-auto rounded-none md:aspect-auto md:box-border md:caret-transparent md:h-full md:max-h-[75px] md:max-w-[75px] md:min-h-[auto] md:min-w-[auto] md:object-contain md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:align-baseline md:w-full md:[mask-position:0%] md:bg-left-top md:p-2.5 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[17px]"
              />
            </div>
          ))}
      </div>
      <div className=" static box-content caret-black transform-none left-auto top-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:translate-y-[-50.0%] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-2.5 md:top-2/4">
        {" "}
        ❮{" "}
      </div>
      <div className="static box-content caret-black transform-none right-auto top-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:translate-y-[-50.0%] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:right-2.5 md:top-2/4">
        {" "}
        ❯{" "}
      </div>
    </div>
  );
};
