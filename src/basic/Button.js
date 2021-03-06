import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Platform, View, TouchableNativeFeedback } from "react-native";
import { connectStyle } from "native-base-shoutem-theme";
import variable from "./../theme/variables/platform";
import { Text } from "./Text";
import computeProps from "../Utils/computeProps";

import mapPropsToStyleNames from "../Utils/mapPropsToStyleNames";

class Button extends Component {

	static contextTypes = {
		theme: PropTypes.object,
	};

	getInitialStyle() {
		return {
			borderedBtn: {
				borderWidth: this.props.bordered ? 1 : undefined,
				borderRadius: this.props.rounded && this.props.bordered ? variable.borderRadiusLarge : 2,
			},
		};
	}

	_root: React$Element<TouchableOpacity | TouchableNativeFeedback>;

	prepareRootProps() {
		const defaultProps = {
			style: this.getInitialStyle().borderedBtn,
		};

		return computeProps(this.props, defaultProps);
	}
	render() {
		const variables = this.context.theme ? this.context.theme["@@shoutem.theme/themeStyle"].variables : variable;
		if (Platform.OS !== "android" || variables.androidRipple === false || Platform["Version"] <= 21) {
			return (
				<TouchableOpacity
					{...this.prepareRootProps()}
					ref={c => (this._root = c)}
					activeOpacity={this.props.activeOpacity > 0 ? this.props.activeOpacity : 0.5}
				>
					{this.props.children}
				</TouchableOpacity>
			);
		} else {
      const children = React.Children.map(
        this.props.children,
        child =>
          child && child.type === Text
            ? React.cloneElement(child, { uppercase: variables.btnUppercaseAndroidText, ...child.props })
            : child
      )
			return (
				<TouchableNativeFeedback
					ref={c => (this._root = c)}
					onPress={this.props.onPress}
					background={
						this.props.androidRippleColor
							? TouchableNativeFeedback.Ripple(this.props.androidRippleColor)
							: TouchableNativeFeedback.Ripple(variables.androidRippleColor)
					}
					{...this.prepareRootProps()}
				>
					<View {...this.prepareRootProps()}>
						{children}
					</View>
				</TouchableNativeFeedback>
			);
		}
	}
}

Button.propTypes = {
	...TouchableOpacity.propTypes,
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
	block: PropTypes.bool,
	primary: PropTypes.bool,
	transparent: PropTypes.bool,
	success: PropTypes.bool,
	danger: PropTypes.bool,
	warning: PropTypes.bool,
	info: PropTypes.bool,
	bordered: PropTypes.bool,
	disabled: PropTypes.bool,
	rounded: PropTypes.bool,
	large: PropTypes.bool,
	small: PropTypes.bool,
	active: PropTypes.bool,
};

const StyledButton = connectStyle("NativeBase.Button", {}, mapPropsToStyleNames)(Button);
export { StyledButton as Button };
