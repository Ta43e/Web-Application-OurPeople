import styled from "styled-components";

export const ColumnContainer = styled.div<{
  color? : string
  horizontal?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around",
  vertical?: "flex-start" | "center" | "flex-end" | "space-between",
  padding?: number | [number?, number?, number?, number?],
  width? : number;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  height: auto;
  box-sizing: border-box;
  align-items: ${({ horizontal }) => horizontal || "flex-start"};
  justify-content: ${({ vertical }) => vertical || "flex-start"};
  background-color: ${props => props.color ? props.color : "transparent"};
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
