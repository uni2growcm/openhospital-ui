import type { createInstance } from '@module-federation/enhanced/runtime';
import type {
	PluginBundle,
	PluginBundleLocationEnum,
} from '~/generated/models/PluginBundle';

export type Remote = Parameters<
	typeof createInstance
>[number]['remotes'][number] &
	PluginBundle & {
		id: string;
	};

export type PluginRenderProps = {
	location: PluginBundleLocationEnum;
	remote: string;
	entry: string;
	styles?: string;
	export?: string;
};
