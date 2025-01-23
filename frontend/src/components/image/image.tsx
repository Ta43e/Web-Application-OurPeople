import { FC, HTMLAttributes } from "react";
import { StyledImage } from "./image.styles";
import React from "react";


export type ImageProps = {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
} & HTMLAttributes<HTMLElement>;

export const Image: FC<ImageProps> = ({src, alt, width, height, ...rest}) => (
    <StyledImage width={width} height={height} src={src} alt={alt} {...rest} />
);
