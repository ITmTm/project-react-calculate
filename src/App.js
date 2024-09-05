import React, { useState, useCallback, useMemo } from "react";

import Wrapper from "./components/Wrapper/Wrapper";
import Screen from "./components/Screen/Screen";
import ButtonBox from "./components/ButtonBox/ButtonBox";
import Button from "./components/Button/Button";

const toLocaleString = (num) => String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');

const removeSpaces = (num) => (num !== undefined && num !== null) ? num.toString().replace(/\s/g, '') : '0';

const math = (a, b, sign) => {
		switch (sign) {
				case '+':
						return a + b;
				case '-':
						return a - b;
				case 'X':
						return a * b;
				case '/':
						return b === 0 ? "Can't divide by 0" : a / b;		// Проверка деления на 0
				default:
						return 0;
		}
};

const App = () => {
		let [calc, setCalc] = useState({
				sign: '',
				num: 0,
				res: 0,
		});

		// Мемоизация массива кнопок
		const btnValues = useMemo(() => [
				['C', '+-', '%', '/'],
				[7, 8, 9, 'X'],
				[4, 5, 6, '-'],
				[1, 2, 3, '+'],
				[0, '.', '='],
		], []);


		const numClickHandler = useCallback((value) => {
				setCalc((prevState) => {
						const numWithoutSpaces = removeSpaces(prevState.num);
						if (numWithoutSpaces.length < 16) {
								const newNum = numWithoutSpaces % 1 === 0 && !prevState.num?.toString().includes(".")
									? toLocaleString(Number(numWithoutSpaces + value))
									: toLocaleString(numWithoutSpaces + value);

								return {
										...prevState,
										num: newNum,
										res: !prevState.sign ? 0 : prevState.res,
								};
						}
						return prevState; 			// Если длинна больше 16, возвращаем текущее состояние
				});
		}, []);

		const buttonClickHandler = useCallback((btn) => {
				if (/[0-9]/.test(btn)) {
						// Если нажата цифра, вызываем numClickHandler
						numClickHandler(btn)
						return;
				}


				setCalc((prevState) => {
						switch (btn) {
								case 'C':
								case prevState.res === "Can't divide by 0":
										return {
												sign: '',
												num: 0,
												res: 0,
										};
								case '+-':
										return {
												...prevState,
												num: prevState.num ? toLocaleString(removeSpaces(prevState.num) * -1) : 0,
												res: prevState.res ? toLocaleString(removeSpaces(prevState.res) * -1) : 0,
										};
								case '%':
										return {
												...prevState,
												num: prevState.num ? prevState.num / 100 : 0,
												res: prevState.res ? prevState.res / 100 : 0,
										};
								case '=':
										return {
												...prevState,
												res: prevState.num === '0' && prevState.sign === '/'
														? "Can't divide by 0"
														: toLocaleString(
																math(
																		Number(removeSpaces(prevState.res)),
																		Number(removeSpaces(prevState.num)),
																		prevState.sign
																)
														),
												sign: '',
												num: 0,
										};
								case '/':
								case 'X':
								case '-':
								case '+':
										return {
												...prevState,
												sign: btn,
												res: !prevState.num
														? prevState.res
														: !prevState.res
																? prevState.num
																: toLocaleString(
																		math(
																				Number(removeSpaces(prevState.res)),
																				Number(removeSpaces(prevState.num)),
																				prevState.sign
																		)
																),
												num: 0
										};
								case '.':
										return {
												...prevState,
												num: !prevState.num?.toString().includes(".") ? prevState.num + "." : prevState.num,
										};
								default:
										return prevState;
						}
				});
		}, [numClickHandler]);


		return (
				<Wrapper>
						<Screen value={calc.num ? calc.num : calc.res} />
						<ButtonBox>
								{btnValues.flat().map((btn, i) => {
										return (
												<Button
														key={i}
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