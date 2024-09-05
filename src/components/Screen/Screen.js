import React, {useRef, useEffect, useCallback} from "react";

import './screen.scss';

const Screen = ({ value }) => {
		const textRef = useRef(null);

		const adjustFontSize = useCallback(() => {
				const element = textRef.current;
				if (!element) return;

				let maxFontSize = 70;
				let minFontSize = 1;
				element.style.fontSize = `${maxFontSize}px`;

				// Использование двоичного поиска для быстрого уменьшения размера шрифта
				while (maxFontSize - minFontSize > 1) {
						const midFontSize = Math.floor((minFontSize + maxFontSize) / 2);
						element.style.fontSize = `${midFontSize}px`;

						if (element.scrollWidth > element.clientWidth) {
								maxFontSize = midFontSize;
						} else {
								minFontSize = midFontSize;
						}
				}

				element.style.fontSize = `${minFontSize}px`;
		}, [value]);

		useEffect(() => {
				adjustFontSize();
		}, [value, adjustFontSize()]);

		useEffect(() => {
				const handleResize = () => {
						adjustFontSize();
				};

				window.addEventListener('resize', handleResize);
				return () => {
						window.removeEventListener('resize', handleResize);
				};
		}, [adjustFontSize]);


		return (
				<div className='screen'>
						<p className='responsive-text' ref={textRef}>
								{value}
						</p>
				</div>
		);
};

export default Screen;