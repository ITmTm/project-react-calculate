import React, { useState, useCallback, useMemo } from "react";

import Wrapper from "./components/Wrapper/Wrapper";
import Screen from "./components/Screen/Screen";
import ButtonBox from "./components/ButtonBox/ButtonBox";
import Button from "./components/Button/Button";

interface CalcState {
	sign: string;
	num: string;
	res: number | string;
}

const MAX_VALUE = 1e12;

// Функция для формирования чисел
export const toLocaleString = (num: string | number) => String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');

// Функция для удаления пробелов
const removeSpaces = (num: string | number) => (num !== undefined && num !== null) ? num.toString().replace(/\s/g, '') : '0';

const math = (a: number, b: number, sign: string): number | string => {
	let result: number | string;

	switch (sign) {
		case '+':
			result = a + b;
			break;
		case '-':
			result = a - b;
			break;
		case 'X':
			result = a * b;
			break
		case '/':
			result = b === 0 ? "Can't divide by 0" : a / b;		// Проверка деления на 0
			break;
		default:
			result = 0;
	}

	// Проверка на переполнение
	if (typeof result === 'number' && (result > MAX_VALUE || result < -MAX_VALUE)) {
		return 'Overflow';
	}

	return result;
};

	// Функция для сброса состояния кулькулятора
const resetCalc = (): CalcState => ({
	sign: '',
	num: '0',
	res: 0,
});

const App: React.FC = () => {
	const [calc, setCalc] = useState<CalcState>({
		sign: '',
		num: '0',
		res: 0,
	});

	// Мемоизация массива кнопок
	const btnValues: string[][] = useMemo(() => [
		['C', '+-', '%', '/'],
		['7', '8', '9', 'X'],
		['4', '5', '6', '-'],
		['1', '2', '3', '+'],
		['0', '.', '='],
	], []);


	// Обработка нажатии цифр
	const numClickHandler = useCallback((value: string) => {
		setCalc((prevState) => {
			// Если на экране 'Overflow', ввод блокируется
			if (prevState.num === 'Overflow' || prevState.res === 'Overflow') {
				return prevState;
			}

			const numWithoutSpaces = removeSpaces(prevState.num);
			if (numWithoutSpaces.length < 16) {
				const newNum = numWithoutSpaces % 1 === 0 && !prevState.num.includes(".")
					? toLocaleString(Number(numWithoutSpaces + value))
					: toLocaleString(numWithoutSpaces + value);

				// Проверка на переполнение
				if (Number(newNum.replace(/\s/g, "")) > MAX_VALUE) {
					return {
						...prevState,
						num: 'Overflow',
					}
				}

				return {
					...prevState,
					num: newNum,
					res: !prevState.sign ? 0 : prevState.res,
				};
			}
			return prevState; 			// Если длинна больше 16, возвращаем текущее состояние
		});
	}, []);

	const buttonClickHandler = useCallback((btn: string) => {
		if (isFinite(Number(btn))) {
			// Если нажата цифра, вызываем numClickHandler
			numClickHandler(btn)
			return;
		}


		setCalc((prevState: CalcState): CalcState => {

			// Обработка нажатия на 'C' для сброса состояния
			if (btn === 'C') {
				return resetCalc();
			}

			// Если на экране 'Overflow', блокируем дальнейший ввод
			if (prevState.num === 'Overflow' || prevState.res === 'Overflow') {
				return prevState;
			}

			switch (btn) {
				case '+-':
					return {
						...prevState,
						num: prevState.num ? toLocaleString(Number(removeSpaces(prevState.num)) * -1) : '0',
						res: prevState.res ? Number(toLocaleString(Number(removeSpaces(prevState.res)) * -1)): 0,
					};
				case '%':
					return {
						...prevState,
						num: prevState.num ? (Number(prevState.num) / 100).toString() : '0',
						res: prevState.res ? prevState.res / 100 : 0,
					};
				case '=':
					if (prevState.sign && prevState.num !== '') {
						const result = math(
							Number(removeSpaces(prevState.res)),
							Number(removeSpaces(prevState.num)),
							prevState.sign
						);

						// Если результат переполнен, выводим только сообщение
						if (result === 'Overflow') {
							return {
								...prevState,
								res: 'Overflow',
								sign: '',
								num: '',
							};
						}

						// Форматирование результата
						const formattedResult = typeof result === 'number' && !isNaN(result)
							? toLocaleString(result)
							: result;

						return {
							...prevState,
							res: formattedResult,
							sign: '',
							num: '',
						};
					}
					return prevState;
				case '/':
				case 'X':
				case '-':
				case '+':
					return {
						...prevState,
						sign: btn,
						res: prevState.num !== ''
							? Number(removeSpaces(prevState.num))
							: prevState.res,
						num: '',
					};
				case '.':
					if (!prevState.num.includes(".")) {
						return {
							...prevState,
							num: prevState.num + ".",
						};
					}
					return prevState;
				default:
					return prevState;
			}
		});
	}, [numClickHandler]);


	return (
		<Wrapper>
			<Screen value={calc.num ? calc.num : calc.res} />
			<ButtonBox>
				{btnValues.flat().map((btn: string, i: number) => {
					return (
						<Button
							key={`${btn}-${i}`} // key используется только для оптимизации рендеринга
							className={btn === '=' ? 'equals' : ''}
							value={btn}
							onClick={() => buttonClickHandler(btn)}
						/>
					);
				})}
			</ButtonBox>
		</Wrapper>
	);
};


export default App;