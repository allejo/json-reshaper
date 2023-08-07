import ExtendRule from 'postcss-extend-rule';
import NestingRule from 'postcss-nesting';

/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [ExtendRule, NestingRule],
};

export default config;
