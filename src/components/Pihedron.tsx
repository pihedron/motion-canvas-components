import { Rect, RectProps, signal } from '@motion-canvas/2d'
import { all, makeRef, SignalValue, SimpleSignal } from '@motion-canvas/core'
import { List } from './List'
import { Index } from './Index'

export interface PihedronProps extends RectProps {
  values: SignalValue<string[]>
}

export class Pihedron extends Rect {
  @signal()
  public declare readonly values: SimpleSignal<string[], this>

  public list: List
  public index: Index

  public constructor(props: PihedronProps) {
    super({
      layout: true,
      direction: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      ...props,
    })

    this
      .add(<List values={this.values()} fill={'#404040'} ref={makeRef(this, 'list')}></List>)
      .add(<Index length={this.values().length} ref={makeRef(this, 'index')}></Index>)
  }

  public *push(value: string, duration: number) {
    yield* all(
      this.list.push(value, duration),
      this.index.push(duration),
    )
  }

  public *pop(duration: number) {
    yield* all(
      this.list.pop(duration),
      this.index.pop(duration),
    )
  }

  public *highlight(index: number, duration: number) {
    yield* all(
      this.list.highlight(index, duration),
      this.index.highlight(index, duration),
    )
  }

  public *unhighlight(duration: number) {
    yield* all(
      this.list.unhighlight(duration),
      this.index.unhighlight(duration),
    )
  }

  public *place(value: string, index: number, duration: number) {
    yield* all(
      this.list.place(value, index, duration),
      this.index.push(duration),
    )
  }

  public *delete(index: number, duration: number) {
    yield* all(
      this.list.delete(index, duration),
      this.index.pop(duration),
    )
  }

  public *set(value: string, index: number, duration: number) {
    yield* all(
      this.list.set(value, index, duration)
    )
  }
}