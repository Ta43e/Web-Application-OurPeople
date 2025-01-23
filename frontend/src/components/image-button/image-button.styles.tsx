import styled from "styled-components";

export const StyledImageButton = styled.img<{ 
  width?: number, 
  height?: number
}>`
  cursor: pointer;
  width: ${props => (props.width ? `${props.width}px` : "auto")};
  height: ${props => (props.height ? `${props.height}px` : "auto")};
`;
