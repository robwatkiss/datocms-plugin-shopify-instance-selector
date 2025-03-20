import { connect } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import SidebarLinks from "./entrypoints/SidebarLinks";
import InstanceSelectorExtension from "./entrypoints/InstanceSelectorExtension";
import InstanceSelectorConfigScreen from "./entrypoints/InstanceSelectorConfigScreen";
import BrowseModal from "./components/BrowseModal";
import { render } from "./utils/render";

connect({
	renderConfigScreen(ctx) {
		return render(<ConfigScreen ctx={ctx} />);
	},
	itemFormSidebarPanels () {
		return [{
			id: 'sidebar-links',
			label: 'Shopify Links',
			icon: 'link',
			position: 'bottom',
		}]
	},
	renderItemFormSidebarPanel(_sidebarPaneId, ctx) {
		render(<SidebarLinks ctx={ctx} />);
	},
	manualFieldExtensions(_ctx) {
		return [
		  {
			id: 'instance-selector',
			name: 'Shopify Instance Selector',
			type: 'editor',
			fieldTypes: ['string'],
			configurable: true
		  },
		];
	},
	renderManualFieldExtensionConfigScreen (fieldExtensionId, ctx) {
		switch (fieldExtensionId) {
			case 'instance-selector':
				return render(<InstanceSelectorConfigScreen ctx={ctx} />);
		}
	},
	renderFieldExtension (fieldExtensionId, ctx) {
		switch (fieldExtensionId) {
			case 'instance-selector':
				return render(<InstanceSelectorExtension ctx={ctx} />);
		}
	},
	renderModal(modalId, ctx) {
		switch (modalId) {
			case 'browse':
				return render(<BrowseModal ctx={ctx} />);
		}
	}
});
