import { Injectable } from '@ali/common-di';
import { URI, Event, BasicEvent, IDisposable, MaybeNull, IRange, ISelection } from '@ali/ide-core-common';
import { IResource } from './resource';
import { IThemeColor } from '@ali/ide-theme/lib/common/color';
import { IEditorDocumentModel, IEditorDocumentModelRef } from '../browser';

export interface CursorStatus {
  position: MaybeNull<monaco.Position>;
  selectionLength: number;
}

/**
 * 一个IEditor代表了一个最小的编辑器单元，可以是CodeEditor中的一个，也可以是DiffEditor中的两个
 */
export interface IEditor {

  getId(): string;
  /**
   * editor中打开的documentModel
   */

  currentDocumentModel: IEditorDocumentModel | null;

  currentUri: URI | null;

  getSelections(): ISelection[] | null;

  insertSnippet(template: string, ranges: readonly IRange[], opts: IUndoStopOptions);

  applyDecoration(key: string, options: IDecorationApplyOptions[]);

  onSelectionsChanged: Event<{ selections: ISelection[], source: string}>;

  onVisibleRangesChanged: Event<IRange[]>;

  onConfigurationChanged: Event<void>;

  setSelections(selection: IRange[] | ISelection[]);

  setSelection(selection: IRange | ISelection);

  updateOptions(editorOptions: any, modelOptions: any);

  save(): Promise<void>;
}

export interface IUndoStopOptions {
  undoStopBefore: boolean;
  undoStopAfter: boolean;
}

export interface ICodeEditor extends IEditor, IDisposable {

  layout(): void;

  /**
   * 打开一个 document
   * @param uri
   */
  open(documentModelRef: IEditorDocumentModelRef, range?: IRange): Promise<void>;

  focus(): void;

  // TODO monaco.position和lsp的是不兼容的
  onCursorPositionChanged: Event<CursorStatus>;
  onRefOpen: Event<IEditorDocumentModelRef>;
}

/**
 * Diff 编辑器抽象
 */
export interface IDiffEditor extends IDisposable {

  compare(originalDocModelRef: IEditorDocumentModelRef, modifiedDocModelRef: IEditorDocumentModelRef);

  originalEditor: IEditor;

  modifiedEditor: IEditor;

  layout(): void;

  focus(): void;

  getLineChanges(): ILineChange[] | null;
}

@Injectable()
export abstract class EditorCollectionService {
  public abstract async createCodeEditor(dom: HTMLElement, options?: any): Promise<ICodeEditor>;
  public abstract async createDiffEditor(dom: HTMLElement, options?: any): Promise<IDiffEditor>;
  public abstract listEditors(): IEditor[];
  public abstract listDiffEditors(): IDiffEditor[];

  public abstract onCodeEditorCreate: Event<ICodeEditor>;
  public abstract onDiffEditorCreate: Event<IDiffEditor>;
}

export type IOpenResourceResult = {group: IEditorGroup, resource: IResource} | false;
/**
 * 当前显示的Editor列表发生变化时
 */
export class CollectionEditorsUpdateEvent extends BasicEvent<IEditor[]> {}

/**
 * 当EditorGroup中打开的uri发生改变时
 */
export class DidChangeEditorGroupUriEvent extends BasicEvent<URI[][]> {}

export interface IEditorGroup {

  index: number;

  name: string;

  codeEditor: ICodeEditor;

  currentEditor: IEditor | null;

  resources: IResource[];

  currentResource: MaybeNull<IResource>;

  currentOpenType: MaybeNull<IEditorOpenType>;

  open(uri: URI, options: IResourceOpenOptions): Promise<IOpenResourceResult >;

  close(uri: URI): Promise<void>;

  getState(): IEditorGroupState;

  restoreState(IEditorGroupState): Promise<void>;

}
export abstract class WorkbenchEditorService {

  onActiveResourceChange: Event<MaybeNull<IResource>>;

  onCursorChange: Event<CursorStatus>;

  // TODO
  editorGroups: IEditorGroup[];

  currentEditor: IEditor | null;

  currentResource: MaybeNull<IResource>;

  currentEditorGroup: IEditorGroup;

  abstract  async closeAll(uri?: URI): Promise<void>;

  abstract async open(uri: URI, options?: IResourceOpenOptions): Promise<IOpenResourceResult>;
  abstract async openUris(uri: URI[]): Promise<void>;

  abstract saveAll(includeUntitled?: boolean): Promise<void>;

}

export interface IResourceOpenOptions {

  range?: IRange;

  index?: number;

  backend?: boolean;

  groupIndex?: number;

  split?: EditorGroupSplitAction;

  preserveFocus?: boolean;

  forceOpenType?: IEditorOpenType;

  disableNavigate?: boolean;

  /**
   * 是否使用preview模式
   * 如果是undefined，使用editor.previewMode配置作为默认值
   */
  preview?: boolean;
}

export interface Position {
  /**
   * Line position in a document (zero-based).
   * If a line number is greater than the number of lines in a document, it defaults back to the number of lines in the document.
   * If a line number is negative, it defaults to 0.
   */
  line: number;
  /**
   * Character offset on a line in a document (zero-based). Assuming that the line is
   * represented as a string, the `character` value represents the gap between the
   * `character` and `character + 1`.
   *
   * If the character value is greater than the line length it defaults back to the
   * line length.
   * If a line number is negative, it defaults to 0.
   */
  character: number;
}

/**
 * A single edit operation, that acts as a simple replace.
 * i.e. Replace text at `range` with `text` in model.
 */
export interface ISingleEditOperation {
  /**
   * The range to replace. This can be empty to emulate a simple insert.
   */
  range: IRange;
  /**
   * The text to replace with. This can be null to emulate a simple delete.
   */
  text: string | null;
  /**
   * This indicates that this operation has "insert" semantics.
   * i.e. forceMoveMarkers = true => if `range` is collapsed, all markers at the position will be moved.
   */
  forceMoveMarkers?: boolean;
}

/**
 * End of line character preference.
 */
export const enum EndOfLineSequence {
  /**
   * Use line feed (\n) as the end of line character.
   */
  LF = 0,
  /**
   * Use carriage return and line feed (\r\n) as the end of line character.
   */
  CRLF = 1,
}

/**
 * End of line character preference.
 */
export const enum EOL {

  LF = '\n',

  CRLF = '\r\n',
}

/**
 * @internal
 */
export interface IThemeDecorationRenderOptions {
  backgroundColor?: string | IThemeColor;

  outline?: string;
  outlineColor?: string | IThemeColor;
  outlineStyle?: string;
  outlineWidth?: string;

  border?: string;
  borderColor?: string | IThemeColor;
  borderRadius?: string;
  borderSpacing?: string;
  borderStyle?: string;
  borderWidth?: string;

  fontStyle?: string;
  fontWeight?: string;
  textDecoration?: string;
  cursor?: string;
  color?: string | IThemeColor;
  opacity?: string;
  letterSpacing?: string;

  gutterIconPath?: UriComponents;
  gutterIconSize?: string;

  overviewRulerColor?: string | IThemeColor;

  before?: IContentDecorationRenderOptions;
  after?: IContentDecorationRenderOptions;
}

/**
 * @internal
 */
export interface IContentDecorationRenderOptions {
  contentText?: string;
  contentIconPath?: UriComponents;

  border?: string;
  borderColor?: string | IThemeColor;
  fontStyle?: string;
  fontWeight?: string;
  textDecoration?: string;
  color?: string | IThemeColor;
  backgroundColor?: string | IThemeColor;

  margin?: string;
  width?: string;
  height?: string;
}

/**
 * @internal
 */
export interface IDecorationRenderOptions extends IThemeDecorationRenderOptions {
  isWholeLine?: boolean;
  rangeBehavior?: TrackedRangeStickiness;
  overviewRulerLane?: OverviewRulerLane;

  light?: IThemeDecorationRenderOptions;
  dark?: IThemeDecorationRenderOptions;
}

export interface UriComponents {
  scheme: string;
  authority: string;
  path: string;
  query: string;
  fragment: string;
}

export interface ITextEditorDecorationType extends IDisposable {

  key: string;

}

export const enum TrackedRangeStickiness {
  AlwaysGrowsWhenTypingAtEdges = 0,
  NeverGrowsWhenTypingAtEdges = 1,
  GrowsOnlyWhenTypingBefore = 2,
  GrowsOnlyWhenTypingAfter = 3,
}

export enum OverviewRulerLane {
  Left = 1,
  Center = 2,
  Right = 4,
  Full = 7,
}

export interface IDecorationApplyOptions {

  hoverMessage?: IHoverMessage;

  range: IRange;

  renderOptions?: IDecorationRenderOptions;

}
export interface IMarkdownString {
  value: string;
  isTrusted?: boolean;
  uris?: {
    [href: string]: UriComponents;
  };
}

export type IHoverMessage = IMarkdownString | IMarkdownString[] | string;

// 定义一个resource如何被打开
export interface IEditorOpenType {

  type: 'code' | 'diff' | 'component';

  componentId?: string;

  title?: string;

  readonly?: boolean;

  // 默认0， 大的排在前面
  weight?: number;

}

export enum EditorGroupSplitAction {
  Top = 1,
  Bottom = 2,
  Left = 3,
  Right = 4,
}

export interface IEditorGroupState {

  uris: string[];

  current?: string;

  previewIndex: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

/**
 * A change
 */
export interface IChange {
  readonly originalStartLineNumber: number;
  readonly originalEndLineNumber: number;
  readonly modifiedStartLineNumber: number;
  readonly modifiedEndLineNumber: number;
}

/**
 * A character level change.
 */
export interface ICharChange extends IChange {
  readonly originalStartColumn: number;
  readonly originalEndColumn: number;
  readonly modifiedStartColumn: number;
  readonly modifiedEndColumn: number;
}

/**
 * A line change
 */
export interface ILineChange extends IChange {
  readonly charChanges: ICharChange[] | undefined;
}
