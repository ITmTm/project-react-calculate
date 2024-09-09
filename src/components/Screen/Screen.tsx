import React, {useRef, useEffect, useCallback} from "react";
import { toLocaleString } from "../../App";

import './screen.scss';

interface ScreenProps {
	value: string | number;
}

const Screen: React.FC<ScreenProps> = ({ value }) => {
		const textRef = useRef<HTMLParagraphElement>(null);
		const resizeTimeoutRef = useRef<number | null>(null);

			// Форматирование числа перед выводом на экран
	const formattedValue =
		typeof value === 'number' || !isNaN(Number(value))
			? toLocaleString(value)
			: value;

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
		}, []);

		useEffect(() => {
				adjustFontSize();
		}, [formattedValue, adjustFontSize]);

		useEffect(() => {
				const handleResize = () => {
						// Очищаем предыдущий таймаут
						if (resizeTimeoutRef.current !== null) {
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
						if (resizeTimeoutRef.current !== null) {
								clearTimeout(resizeTimeoutRef.current);
						}
				};
		}, [adjustFontSize]);


		return (
				<div className='screen'>
						<p className='responsive-text' ref={textRef}>
								{formattedValue}
						</p>
				</div>
		);
};

export default Screen;