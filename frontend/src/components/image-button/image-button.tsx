import { FC, HTMLAttributes } from "react";
import { StyledImageButton } from "./image-button.styles";
import React from "react";

export type ImageButtonProps = {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
    onClick?: () => void;
} & HTMLAttributes<HTMLElement>;

export const ImageButton: FC<ImageButtonProps> = ({onClick, src, alt, width, height, ...rest}) => (
    <StyledImageButton onClick={onClick} width={width} height={height} src={src} alt={alt} {...rest} />
);
