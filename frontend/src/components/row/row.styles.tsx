import styled from "styled-components";
  
export const RowContainer = styled.div<{
  horizontal?: "flex-start" | "center" | "flex-end" | "space-between";
  vertical?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around",
  padding?: number | [number?, number?, number?, number?],
  width? : number | string,
  height? : number | string,
  color?: string
}>`
    display: flex;
    background-color: ${({ color }) => color || "transparent"};
    flex-direction: row;
    width: ${({ width }) => {
      if(typeof width === 'number'){
        return `${width}px`
      }
      else if (typeof width === 'string'){
        return `${width}`
      }
      else return 'auto'
    }};
    width: ${({ height }) => {
      if(typeof height === 'number'){
        return `${height}px`
      }
      else if (typeof height === 'string'){
        return `${height}`
      }
      else return 'auto'
    }};
    align-items: ${({ vertical }) => vertical || "flex-start"};
    justify-content: ${({ horizontal }) => horizontal || "flex-start"};
    padding: ${({ padding }) => {
    if (typeof padding === "number") {
      return `${padding}px`;
    }
    if (Array.isArray(padding)) {
      if (padding.length === 1) {
        return padding[0];
      }
      if (padding.length === 2) {
        return `${padding[0]}px ${padding[1]}px`;
      }
      if (padding.length === 4) {
        return `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`;
      }
    }
    return "0";
    }};
  `;
  