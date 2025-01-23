// import { FC, HTMLAttributes, useRef, useState } from "react";
// import React from "react";
// import { StyledDivider } from "./divider.styles";


// export type DividerProps = {} & HTMLAttributes<HTMLElement>;

// export const Divider: FC<DividerProps> = ({}) => {
//   const [isDragging, setIsDragging] = useState<boolean>(false);
//   const [position, setPosition] = useState<number>(0);
//   const [startPosition, setStartPosition] = useState<number>(0);
//   const dividerRef = useRef<HTMLDivElement>(null);

//   const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
//     setIsDragging(true);
//     setStartPosition(event.clientX);
//   };

//   const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
//     if (isDragging) {
//       if (dividerRef.current) {
//         const offset = event.clientX - startPosition;
//         const newPosition = position + offset;
//         setPosition(newPosition);
//         setStartPosition(event.clientX);
//       }
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   return (
//     <StyledDivider
//       ref={dividerRef}
//       style={{ left: position }}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     ></StyledDivider>
//   );
// };


import { FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import React from "react";
import { StyledDivider } from "./divider.styles";


export type DividerProps = {} & HTMLAttributes<HTMLElement>;

export const Divider: FC<DividerProps> = ({...rest}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [startPosition, setStartPosition] = useState<number>(0);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && dividerRef.current) {
        const offset = event.clientX - startPosition;
        const newPosition = position + offset;
        setPosition(newPosition);
        setStartPosition(event.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position, startPosition]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartPosition(event.clientX);
  };

  return (
    <StyledDivider
      ref={dividerRef}
      style={{ left: position }}
      onMouseDown={handleMouseDown}
      {...rest}
    ></StyledDivider>
  );
};