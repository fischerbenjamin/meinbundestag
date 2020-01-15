/**
 * @author Benjamin Fischer
 * @description
 * Navigation object for the whole application.
 * Wrapper for the navigation container. The BottomTabNavigator could be
 * replaced by another type of navigator.
 * @module Navigation
 */

import { createAppContainer } from 'react-navigation';

import BottomTabNavigator from './BottomTabNavigator';


/**
 * @description Navigator for the whole application
 */
const AppNavigator = createAppContainer(BottomTabNavigator);


export default AppNavigator;
