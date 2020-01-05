/**
 * @file Navigation object for the whole application
 * @author Benjamin Fischer
 *
 * Wrapper for the navigation container. The BottomTabNavigator could be
 * replaced by another type of navigator.
 */

import { createAppContainer } from 'react-navigation';

import BottomTabNavigator from './BottomTabNavigator';


// Create the app navigator based on the bottomtabnavigator
const AppNavigator = createAppContainer(BottomTabNavigator);


export default AppNavigator;
