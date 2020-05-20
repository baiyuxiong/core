/// <reference path="./../typings/vscode.editor.d.ts" />
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

declare module 'vscode' {


	/**
	 * Options to configure the behaviour of the [workspace folder](#WorkspaceFolder) pick UI.
	 */
	export interface WorkspaceFolderPickOptions {

		/**
		 * An optional string to show as place holder in the input box to guide the user what to pick on.
		 */
		placeHolder?: string;

		/**
		 * Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.
		 */
		ignoreFocusOut?: boolean;
	}





	/**
	 * A text edit represents edits that should be applied
	 * to a document.
	 */




















	/**
	 * The completion item provider interface defines the contract between extensions and
	 * [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense).
	 *
	 * Providers can delay the computation of the [`detail`](#CompletionItem.detail)
	 * and [`documentation`](#CompletionItem.documentation) properties by implementing the
	 * [`resolveCompletionItem`](#CompletionItemProvider.resolveCompletionItem)-function. However, properties that
	 * are needed for the initial sorting and filtering, like `sortText`, `filterText`, `insertText`, and `range`, must
	 * not be changed during resolve.
	 *
	 * Providers are asked for completions either explicitly by a user gesture or -depending on the configuration-
	 * implicitly when typing words or trigger characters.
	 */




	/**
	 * Represents the configuration. It is a merged view of
	 *
	 * - Default configuration
	 * - Global configuration
	 * - Workspace configuration (if available)
	 * - Workspace folder configuration of the requested resource (if available)
	 *
	 * *Global configuration* comes from User Settings and shadows Defaults.
	 *
	 * *Workspace configuration* comes from Workspace Settings and shadows Global configuration.
	 *
	 * *Workspace Folder configuration* comes from `.vscode` folder under one of the [workspace folders](#workspace.workspaceFolders).
	 *
	 * *Note:* Workspace and Workspace Folder configurations contains `launch` and `tasks` settings. Their basename will be
	 * part of the section identifier. The following snippets shows how to retrieve all configurations
	 * from `launch.json`:
	 *
	 * ```ts
	 * // launch.json configuration
	 * const config = workspace.getConfiguration('launch', vscode.window.activeTextEditor.document.uri);
	 *
	 * // retrieve values
	 * const values = config.get('configurations');
	 * ```
	 *
	 * Refer to [Settings](https://code.visualstudio.com/docs/getstarted/settings) for more information.
	 */

	/**
	 * An output channel is a container for readonly textual information.
	 *
	 * To get an instance of an `OutputChannel` use
	 * [createOutputChannel](#window.createOutputChannel).
	 */
	/**
	 * Defines a generalized way of reporting progress updates.
	 */
	export interface Progress<T> {

		/**
		 * Report a progress update.
		 * @param value A progress item, like a message and/or an
		 * report on how much work finished
		 */
		report(value: T): void;
	}

	/**
	 * Defines a port mapping used for localhost inside the webview.
	 */
	export interface WebviewPortMapping {
		/**
		 * Localhost port to remap inside the webview.
		 */
		readonly webviewPort: number;

		/**
		 * Destination port. The `webviewPort` is resolved to this port.
		 */
		readonly extensionHostPort: number;
	}

	/**
	 * Restore webview panels that have been persisted when vscode shuts down.
	 *
	 * There are two types of webview persistence:
	 *
	 * - Persistence within a session.
	 * - Persistence across sessions (across restarts of VS Code).
	 *
	 * A `WebviewPanelSerializer` is only required for the second case: persisting a webview across sessions.
	 *
	 * Persistence within a session allows a webview to save its state when it becomes hidden
	 * and restore its content from this state when it becomes visible again. It is powered entirely
	 * by the webview content itself. To save off a persisted state, call `acquireVsCodeApi().setState()` with
	 * any json serializable object. To restore the state again, call `getState()`
	 *
	 * ```js
	 * // Within the webview
	 * const vscode = acquireVsCodeApi();
	 *
	 * // Get existing state
	 * const oldState = vscode.getState() || { value: 0 };
	 *
	 * // Update state
	 * setState({ value: oldState.value + 1 })
	 * ```
	 *
	 * A `WebviewPanelSerializer` extends this persistence across restarts of VS Code. When the editor is shutdown,
	 * VS Code will save off the state from `setState` of all webviews that have a serializer. When the
	 * webview first becomes visible after the restart, this state is passed to `deserializeWebviewPanel`.
	 * The extension can then restore the old `WebviewPanel` from this state.
	 */
	interface WebviewPanelSerializer {
		/**
		 * Restore a webview panel from its serialized `state`.
		 *
		 * Called when a serialized webview first becomes visible.
		 *
		 * @param webviewPanel Webview panel to restore. The serializer should take ownership of this panel. The
		 * serializer must restore the webview's `.html` and hook up all webview events.
		 * @param state Persisted state from the webview content.
		 *
		 * @return Thenable indicating that the webview has been fully restored.
		 */
		deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any): Thenable<void>;
	}


	/**
	 * Namespace for dealing with commands. In short, a command is a function with a
	 * unique identifier. The function is sometimes also called _command handler_.
	 *
	 * Commands can be added to the editor using the [registerCommand](#commands.registerCommand)
	 * and [registerTextEditorCommand](#commands.registerTextEditorCommand) functions. Commands
	 * can be executed [manually](#commands.executeCommand) or from a UI gesture. Those are:
	 *
	 * * palette - Use the `commands`-section in `package.json` to make a command show in
	 * the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
	 * * keybinding - Use the `keybindings`-section in `package.json` to enable
	 * [keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
	 * for your extension.
	 *
	 * Commands from other extensions and from the editor itself are accessible to an extension. However,
	 * when invoking an editor command not all argument types are supported.
	 *
	 * This is a sample that registers a command handler and adds an entry for that command to the palette. First
	 * register a command handler with the identifier `extension.sayHello`.
	 * ```javascript
	 * commands.registerCommand('extension.sayHello', () => {
	 * 	window.showInformationMessage('Hello World!');
	 * });
	 * ```
	 * Second, bind the command identifier to a title under which it will show in the palette (`package.json`).
	 * ```json
	 * {
	 * 	"contributes": {
	 * 		"commands": [{
	 * 			"command": "extension.sayHello",
	 * 			"title": "Hello World"
	 * 		}]
	 * 	}
	 * }
	 * ```
	 */


	/**
	 * A uri handler is responsible for handling system-wide [uris](#Uri).
	 *
	 * @see [window.registerUriHandler](#window.registerUriHandler).
	 */
	export interface UriHandler {

		/**
		 * Handle the provided system-wide [uri](#Uri).
		 *
		 * @see [window.registerUriHandler](#window.registerUriHandler).
		 */
		handleUri(uri: Uri): ProviderResult<void>;
	}

	/**
	 * A location in the editor at which progress information can be shown. It depends on the
	 * location how progress is visually represented.
	 */
	export enum ProgressLocation {

		/**
		 * Show progress for the source control viewlet, as overlay for the icon and as progress bar
		 * inside the viewlet (when visible). Neither supports cancellation nor discrete progress.
		 */
		SourceControl = 1,

		/**
		 * Show progress in the status bar of the editor. Neither supports cancellation nor discrete progress.
		 */
		Window = 10,

		/**
		 * Show progress as notification with an optional cancel button. Supports to show infinite and discrete progress.
		 */
		Notification = 15,
	}


	/**
	 * An event describing a change to the set of [workspace folders](#workspace.workspaceFolders).
	 */
	export interface WorkspaceFoldersChangeEvent {
		/**
		 * Added workspace folders.
		 */
		readonly added: ReadonlyArray<WorkspaceFolder>;

		/**
		 * Removed workspace folders.
		 */
		readonly removed: ReadonlyArray<WorkspaceFolder>;
	}


	/**
	 * Namespace for dealing with the current workspace. A workspace is the representation
	 * of the folder that has been opened. There is no workspace when just a file but not a
	 * folder has been opened.
	 *
	 * The workspace offers support for [listening](#workspace.createFileSystemWatcher) to fs
	 * events and for [finding](#workspace.findFiles) files. Both perform well and run _outside_
	 * the editor-process so that they should be always used instead of nodejs-equivalents.
	 */
	export namespace workspace {

	}

  export namespace language {

		/**
		 * Register a declaration provider.
		 *
		 * Multiple providers can be registered for a language. In that case providers are asked in
		 * parallel and the results are merged. A failing provider (rejected promise or exception) will
		 * not cause a failure of the whole operation.
		 *
		 * @param selector A selector that defines the documents this provider is applicable to.
		 * @param provider A declaration provider.
		 * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
		 */
		export function registerDeclarationProvider(selector: DocumentSelector, provider: DeclarationProvider): Disposable;

  }

	/**
	 * An event describing the change in Configuration
	 */
	export interface ConfigurationChangeEvent {

		/**
		 * Returns `true` if the given section for the given resource (if provided) is affected.
		 *
		 * @param section Configuration name, supports _dotted_ names.
		 * @param resource A resource Uri.
		 * @return `true` if the given section for the given resource (if provided) is affected.
		 */
		affectsConfiguration(section: string, resource?: Uri): boolean;
	}

	//#region Comments

	/**
	 * Collapsible state of a [comment thread](#CommentThread)
	 */
	export enum CommentThreadCollapsibleState {
		/**
		 * Determines an item is collapsed
		 */
		Collapsed = 0,

		/**
		 * Determines an item is expanded
		 */
		Expanded = 1,
	}

	/**
	 * Comment mode of a [comment](#Comment)
	 */
	export enum CommentMode {
		/**
		 * Displays the comment editor
		 */
		Editing = 0,

		/**
		 * Displays the preview of the comment
		 */
		Preview = 1,
	}

	/**
	 * A collection of [comments](#Comment) representing a conversation at a particular range in a document.
	 */
	export interface CommentThread {
		/**
		 * The uri of the document the thread has been created on.
		 */
		readonly uri: Uri;

		/**
		 * The range the comment thread is located within the document. The thread icon will be shown
		 * at the first line of the range.
		 */
		range: Range;

		/**
		 * The ordered comments of the thread.
		 */
		comments: ReadonlyArray<Comment>;

		/**
		 * Whether the thread should be collapsed or expanded when opening the document.
		 * Defaults to Collapsed.
		 */
		collapsibleState: CommentThreadCollapsibleState;

		/**
		 * Context value of the comment thread. This can be used to contribute thread specific actions.
		 * For example, a comment thread is given a context value as `editable`. When contributing actions to `comments/commentThread/title`
		 * using `menus` extension point, you can specify context value for key `commentThread` in `when` expression like `commentThread == editable`.
		 * ```
		 *	"contributes": {
		 *		"menus": {
		 *			"comments/commentThread/title": [
		 *				{
		 *					"command": "extension.deleteCommentThread",
		 *					"when": "commentThread == editable"
		 *				}
		 *			]
		 *		}
		 *	}
		 * ```
		 * This will show action `extension.deleteCommentThread` only for comment threads with `contextValue` is `editable`.
		 */
		contextValue?: string;

		/**
		 * The optional human-readable label describing the [Comment Thread](#CommentThread)
		 */
		label?: string;

		/**
		 * Dispose this comment thread.
		 *
		 * Once disposed, this comment thread will be removed from visible editors and Comment Panel when approriate.
		 */
		dispose(): void;
	}

	/**
	 * Author information of a [comment](#Comment)
	 */
	export interface CommentAuthorInformation {
		/**
		 * The display name of the author of the comment
		 */
		name: string;

		/**
		 * The optional icon path for the author
		 */
		iconPath?: Uri;
	}

	/**
	 * Reactions of a [comment](#Comment)
	 */
	export interface CommentReaction {
		/**
		 * The human-readable label for the reaction
		 */
		readonly label: string;

		/**
		 * Icon for the reaction shown in UI.
		 */
		readonly iconPath: string | Uri;

		/**
		 * The number of users who have reacted to this reaction
		 */
		readonly count: number;

		/**
		 * Whether the [author](CommentAuthorInformation) of the comment has reacted to this reaction
		 */
		readonly authorHasReacted: boolean;
	}

	/**
	 * A comment is displayed within the editor or the Comments Panel, depending on how it is provided.
	 */
	export interface Comment {
		/**
		 * The human-readable comment body
		 */
		body: string | MarkdownString;

		/**
		 * [Comment mode](#CommentMode) of the comment
		 */
		mode: CommentMode;

		/**
		 * The [author information](#CommentAuthorInformation) of the comment
		 */
		author: CommentAuthorInformation;

		/**
		 * Context value of the comment. This can be used to contribute comment specific actions.
		 * For example, a comment is given a context value as `editable`. When contributing actions to `comments/comment/title`
		 * using `menus` extension point, you can specify context value for key `comment` in `when` expression like `comment == editable`.
		 * ```json
		 *	"contributes": {
		 *		"menus": {
		 *			"comments/comment/title": [
		 *				{
		 *					"command": "extension.deleteComment",
		 *					"when": "comment == editable"
		 *				}
		 *			]
		 *		}
		 *	}
		 * ```
		 * This will show action `extension.deleteComment` only for comments with `contextValue` is `editable`.
		 */
		contextValue?: string;

		/**
		 * Optional reactions of the [comment](#Comment)
		 */
		reactions?: CommentReaction[];

		/**
		 * Optional label describing the [Comment](#Comment)
		 * Label will be rendered next to authorName if exists.
		 */
		label?: string;
	}

	/**
	 * Command argument for actions registered in `comments/commentThread/context`.
	 */
	export interface CommentReply {
		/**
		 * The active [comment thread](#CommentThread)
		 */
		thread: CommentThread;

		/**
		 * The value in the comment editor
		 */
		text: string;
	}

	/**
	 * Commenting range provider for a [comment controller](#CommentController).
	 */
	export interface CommentingRangeProvider {
		/**
		 * Provide a list of ranges which allow new comment threads creation or null for a given document
		 */
		provideCommentingRanges(document: TextDocument, token: CancellationToken): ProviderResult<Range[]>;
	}

	/**
	 * A comment controller is able to provide [comments](#CommentThread) support to the editor and
	 * provide users various ways to interact with comments.
	 */
	export interface CommentController {
		/**
		 * The id of this comment controller.
		 */
		readonly id: string;

		/**
		 * The human-readable label of this comment controller.
		 */
		readonly label: string;

		/**
		 * Optional commenting range provider. Provide a list [ranges](#Range) which support commenting to any given resource uri.
		 *
		 * If not provided, users can leave comments in any document opened in the editor.
		 */
		commentingRangeProvider?: CommentingRangeProvider;

		/**
		 * Create a [comment thread](#CommentThread). The comment thread will be displayed in visible text editors (if the resource matches)
		 * and Comments Panel once created.
		 *
		 * @param uri The uri of the document the thread has been created on.
		 * @param range The range the comment thread is located within the document.
		 * @param comments The ordered comments of the thread.
		 */
		createCommentThread(uri: Uri, range: Range, comments: Comment[]): CommentThread;

		/**
		 * Optional reaction handler for creating and deleting reactions on a [comment](#Comment).
		 */
		reactionHandler?: (comment: Comment, reaction: CommentReaction) => Promise<void>;

		/**
		 * Dispose this comment controller.
		 *
		 * Once disposed, all [comment threads](#CommentThread) created by this comment controller will also be removed from the editor
		 * and Comments Panel.
		 */
		dispose(): void;
	}

	namespace comments {
		/**
		 * Creates a new [comment controller](#CommentController) instance.
		 *
		 * @param id An `id` for the comment controller.
		 * @param label A human-readable string for the comment controller.
		 * @return An instance of [comment controller](#CommentController).
		 */
		export function createCommentController(id: string, label: string): CommentController;
	}

	//#endregion
}

