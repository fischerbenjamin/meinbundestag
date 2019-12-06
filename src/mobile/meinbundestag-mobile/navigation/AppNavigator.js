import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import BottomTabNavigator from './BottomTabNavigator';

const AppNavigator = createAppContainer(
  createSwitchNavigator({
    main: BottomTabNavigator,
  }),
);

export default AppNavigator;
