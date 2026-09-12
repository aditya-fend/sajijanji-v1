/**
 * 2D TRANSFORM ENGINE - INTERACTION STATE MACHINE
 * 
 * Manages deterministic UI interaction states and event priorities:
 * IDLE -> HOVER_OBJECT -> HOVER_HANDLE -> SELECTED -> DRAGGING_OBJECT -> RESIZING -> ROTATING -> TEXT_EDITING
 */

export enum InteractionState {
  IDLE = "IDLE",
  HOVER_OBJECT = "HOVER_OBJECT",
  HOVER_HANDLE = "HOVER_HANDLE",
  SELECTED = "SELECTED",
  DRAGGING_OBJECT = "DRAGGING_OBJECT",
  RESIZING = "RESIZING",
  ROTATING = "ROTATING",
  TEXT_EDITING = "TEXT_EDITING",
}

export type InteractionPriority = 
  | "ACTIVE_TRANSFORM"
  | "RESIZE_HANDLE"
  | "ROTATE_HANDLE"
  | "SELECTED_OBJECT"
  | "CANVAS";

export class InteractionStateMachine {
  private currentState: InteractionState = InteractionState.IDLE;
  private activeElementId: string | null = null;
  private activeHandle: string | null = null;

  public getState(): InteractionState {
    return this.currentState;
  }

  public getActiveElementId(): string | null {
    return this.activeElementId;
  }

  public getActiveHandle(): string | null {
    return this.activeHandle;
  }

  public transitionTo(newState: InteractionState, elementId: string | null = null, handle: string | null = null): boolean {
    // Guards: Cannot interrupt TEXT_EDITING state unless explicitly exiting to SELECTED or IDLE
    if (this.currentState === InteractionState.TEXT_EDITING && newState !== InteractionState.SELECTED && newState !== InteractionState.IDLE) {
      return false;
    }

    this.currentState = newState;
    this.activeElementId = elementId;
    this.activeHandle = handle;
    return true;
  }

  public canInteractWithHandles(): boolean {
    return this.currentState !== InteractionState.TEXT_EDITING;
  }

  public canStartDrag(): boolean {
    return this.currentState !== InteractionState.TEXT_EDITING && 
           this.currentState !== InteractionState.RESIZING && 
           this.currentState !== InteractionState.ROTATING;
  }

  public isTransformActive(): boolean {
    return this.currentState === InteractionState.DRAGGING_OBJECT ||
           this.currentState === InteractionState.RESIZING ||
           this.currentState === InteractionState.ROTATING;
  }

  public reset(): void {
    this.currentState = InteractionState.IDLE;
    this.activeElementId = null;
    this.activeHandle = null;
  }
}
