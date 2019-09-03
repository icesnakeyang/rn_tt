export default class NavigationUtil {
    static resetToHomePage(params) {
        const {navigation} = params
        navigation.navigate('Main')
    }

    static goPage(params, page) {
        const navigation = NavigationUtil.navigation
        navigation.navigate(
            page,
            {...params}
        )
    }

    static goBack(navigation) {
        navigation.goBack()
    }
}