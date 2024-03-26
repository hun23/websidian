import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { createEncryptedFileToUpload } from "utils";

// Remember to rename these classes and interfaces!

interface WebsidianSettings {
	url: string;
	password: string;
}

const DEFAULT_SETTINGS: WebsidianSettings = {
	url: "",
	password: "",
};

export default class WebsidianPlugin extends Plugin {
	settings: WebsidianSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "open-websidian-upload-modal",
			name: "Open websidian upload modal",
			callback: () => {
				new WebsidianUploadModal(this.app).open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WebsidianSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class WebsidianUploadModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Upload status here!");
		// show upload status here
		// encrypting
		// const fileToUpload: Blob = createEncryptedFileToUpload()
		const a = createEncryptedFileToUpload("thisispassword");
		// uploading
		// done
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class WebsidianSettingTab extends PluginSettingTab {
	plugin: WebsidianPlugin;

	constructor(app: App, plugin: WebsidianPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("URL")
			.setDesc("URL for your websidian api")
			.addText((text) =>
				text
					.setPlaceholder("Enter your url")
					.setValue(this.plugin.settings.url)
					.onChange(async (value) => {
						this.plugin.settings.url = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Password")
			.setDesc("Enter password to encrypt files")
			.addText((text) =>
				text
					.setPlaceholder("Enter your password")
					.setValue(this.plugin.settings.password)
					.onChange(async (value) => {
						this.plugin.settings.password = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
