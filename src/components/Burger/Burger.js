import * as React from 'react';

import './Burger.css';

import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const getBurgerIngredient = ingredients => {
    // return Object.keys(ingredients).reduce((accumulator, currentValue) => {
    // 	const quantity = ingredients[currentValue];
    // 	const quantityIngredient = [...Array(quantity)].reduce((accumulator2, currentValue2) => {
    // 		return [
    // 			...accumulator2,
    // 			<BurgerIngredient key={currentValue + (accumulator2.length + 1)} type={currentValue} />,
    // 		];
    // 	}, []);

    // 	return [...accumulator, ...quantityIngredient];
    // }, []);

    return Object.keys(ingredients)
        .map(key => {
            const quantity = ingredients[key];
            return [...Array(quantity)].map((_, index) => <BurgerIngredient key={key + index} type={key} />);
        })
        .reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
};

const Burger = props => {
    let ingredients = getBurgerIngredient(props.ingredients);
    ingredients.length === 0 && (ingredients = <p>Please start adding ingredients.</p>);

    return (
        <div className='Burger'>
            <BurgerIngredient type='bread-top' />
            {ingredients}
            <BurgerIngredient type='bread-bottom' />
        </div>
    );
};

export default Burger;
