
import React, { useState } from 'react';
import Image from 'next/image';

// THIS IS NOT WORKING RIGHT NOW.
const ImageWithFallback = (props) => {
    const { src, fallbackSrc, ...rest } = props;
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN88B8AAsUB4Z49U0gAAAAASUVORK5CYII="
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
            {...rest}
        />
    );
};

export default ImageWithFallback;