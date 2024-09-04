import React, { useState, useCallback } from "react";

import Wrapper from "./components/Wrapper/Wrapper";
import Screen from "./components/Screen/Screen";
import ButtonBox from "./components/ButtonBox/ButtonBox";
import Button from "./components/Button/Button";

const btnValues = [
		['C', '+-', '%', '/'],
		[7, 8, 9, 'X'],
		[4, 5, 6, '-'],
		[1, 2, 3, '+'],
		[0, '.', '='],
];

const toLocaleString = (num) => String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');

const removeSpaces = (num) => num.toString().replace(/\s/g, '');

const math = (a, b, sign) => {
		switch (sign) {
				case '+': return a + b;
				case '-': return a - b;
				case 'X': return a * b;
				case '/': return a / b;
				default: return 0;
		}
};

const zeroDivisionError = "Can't divide with 0";

const App = () => {
		let [calc, setCalc] = useState({
				sign: '',
				num: 0,
				res: 0,
		});

		const numClickHandler = useCallback((value) => {
				if (removeSpaces(calc.num).length < 16) {
						setCalc((prevState) => ({
								...prevState,
								num: removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")
										? toLocaleString(Number(removeSpaces(calc.num + value)))
										: toLocaleString(calc.num + value),
								res: !calc.sign ? 0 : calc.res,
						}));
				}
		}, [calc]);

		const comaClickHandler = useCallback(() => {
				if (!calc.num.toString().includes(".")) {
						setCalc((prevState) => ({
								...prevState,
								num: calc.num + ".",
						}));
				}
		}, [calc]);

		const signClickHandler = useCallback((sign) => {
				setCalc((prevState) => ({
						...prevState,
						sign,
						res: !calc.num
							? calc.res
							: !calc.res
							? calc.num
							: toLocaleString(math(
									Number(removeSpaces(calc.res)),
									Number(removeSpaces(calc.num)),
									calc.sign
							)),
						num: 0,
				}));
		}, [calc]);

		const equalsClickHandler = useCallback(() => {
				if (calc.sign && calc.num) {
						setCalc((prevState) => ({
								...prevState,
								res:
									calc.num === '0' && calc.sign === '/'
										? zeroDivisionError
										: toLocaleString(math(
												Number(removeSpaces(calc.res)),
												Number(removeSpaces(calc.num)),
												calc.sign
										)),
								sign: '',
								num: 0,
						}));
				}
		}, [calc]);

		const invertClickHandler = useCallback(() => {
				setCalc((prevState) => ({
						...prevState,
						num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
						res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
						sign: '',
				}));
		}, [calc]);

		const percentClickHandler = useCallback(() => {
				setCalc((prevState) => ({
						...prevState,
						num: calc.num ? calc.num / 100 : 0,
						res: calc.res ? calc.res / 100 : 0,
						sign: '',
				}))
		}, [calc]);

		const resetClickHandler = useCallback(() => {
				setCalc({
						sign: '',
						num: 0,
						res: 0,
				});
		}, []);

		const buttonClickHandler = useCallback((btn) => {
				if (btn === 'C' || calc.res === zeroDivisionError) resetClickHandler();
				else if (btn === '+-') invertClickHandler();
				else if (btn === '%') percentClickHandler();
				else if (btn === '=') equalsClickHandler();
				else if (['/', 'X', '-', '+'].includes(btn)) signClickHandler(btn);
				else if (btn === '.') comaClickHandler();
				else numClickHandler(btn)
		}, [calc, resetClickHandler, invertClickHandler, percentClickHandler, equalsClickHandler, signClickHandler, comaClickHandler, numClickHandler]);


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