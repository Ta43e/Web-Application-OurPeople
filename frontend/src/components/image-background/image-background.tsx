import { FC, HTMLAttributes } from "react";
import { StyledImageBackground } from "./image-background.styles";
import React from "react";


export type ImageBackgroundProps = {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
} & HTMLAttributes<HTMLElement>;

export const ImageBackground: FC<ImageBackgroundProps> = ({src, alt, width, height, ...rest}) => (
    <StyledImageBackground width={width} height={height} src={src} {...rest} />
);
