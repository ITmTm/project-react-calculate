import React, {useRef, useEffect, useCallback} from "react";

import './screen.scss';

const Screen = ({ value }) => {
		const textRef = useRef(null);
		const resizeTimeoutRef = useRef(null);

		const adjustFontSize = useCallback(() => {
				const element = textRef.current;
				if (!element) return;

				let maxFontSize = 70;
				let minFontSize = 1;
				let currentFontSize = maxFontSize;

				element.style.fontSize = `${currentFontSize}px`;

				// Двоичный поиск для изменения размера шрифта
				while (maxFontSize - minFontSize > 1) {
						const midFontSize = Math.floor((minFontSize + maxFontSize) / 2);
						element.style.fontSize = `${midFontSize}px`;

						if (element.scrollWidth > element.clientWidth) {
								maxFontSize = midFontSize;
						} else {
								minFontSize = midFontSize;
						}
				}

					// Устанавливаем последнее значение, которое подходило
				element.style.fontSize = `${minFontSize}px`;
		}, [value]);

		useEffect(() => {
				adjustFontSize();
		}, [value, adjustFontSize]);

		useEffect(() => {
				const handleResize = () => {
						// Очищаем предыдущий таймаут
						if (resizeTimeoutRef.current) {
								clearTimeout(resizeTimeoutRef.current);
						}

						// Устанавливаем новый таймаут для дебаунсинга
						resizeTimeoutRef.current = setTimeout(() => {
								adjustFontSize();
						}, 200); // Задержка 200 мс
				};

				window.addEventListener('resize', handleResize);
				return () => {
						window.removeEventListener('resize', handleResize);
						if (resizeTimeoutRef.current) {
								clearTimeout(resizeTimeoutRef.current);
						}
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