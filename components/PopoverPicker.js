import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "./useClickOutside";

export const PopoverPicker = ({ color, onChange, className }) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="picker">
      <a href="#popover"><div
        className={className}
        style={{background:color}}
        onClick={() => {
            toggle(true);
            }}
      /></a>

      {isOpen && (
        <div id="popover" className="popover" ref={popover}>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};