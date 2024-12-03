import { Rect, RectProps, signal, Txt } from '@motion-canvas/2d'
import { all, createRef, easeInCubic, easeOutCubic, SignalValue, SimpleSignal, ThreadGenerator, waitFor } from '@motion-canvas/core'

const fontSize = 32
const width = 128 + 12

export interface IndexProps extends RectProps {
  length: SignalValue<number>
}

export class Index extends Rect {
  @signal()
  public declare readonly length: SimpleSignal<number, this>

  public constructor(props: IndexProps) {
    super({
      layout: true,
      ...props,
    })

    for (let i = 0; i < this.length(); i++) {
      this.add(
        <Rect width={width} layout justifyContent={'center'} alignItems={'center'}>
          <Txt text={i.toString()} fill={'white'} fontSize={fontSize} fontFamily={'JetBrains Mono'} stroke={'white'}></Txt>
        </Rect>
      )
    }
  }

  public *push(duration: number) {
    const item = createRef<Rect>()
    const text = createRef<Txt>()
    const dl = 0.25 * duration

    yield* waitFor(dl)

    this.add(
      <Rect width={0} layout justifyContent={'center'} alignItems={'center'} ref={item}>
        <Txt text={this.length().toString()} fill={'white'} fontSize={0} fontFamily={'JetBrains Mono'} stroke={'white'} ref={text}></Txt>
      </Rect>
    )

    yield* all(
      item().width(width, duration - dl, easeOutCubic),
      text().fontSize(fontSize, duration - dl, easeOutCubic),
    )

    this.length(this.length() + 1)
  }

  public *pop(duration: number) {
    const children = this.children()
    const last = children[children.length - 1] as Rect
    const txt = last.children()[0] as Txt
    const dl = 0.25 * duration

    yield* all(
      last.width(0, duration - dl, easeInCubic),
      txt.fontSize(0, duration - dl, easeInCubic),
    )

    yield* waitFor(dl)

    this.length(this.length() - 1)
  }

  public *highlight(index: number, duration: number) {
    const children = this.getChildren()

    const tasks: ThreadGenerator[] = []

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const txt = child.children()[0] as Txt
      if (i != index) {
        tasks.push(txt.opacity(0.5, duration))
      }
    }

    yield* all(...tasks)
  }

  public *unhighlight(duration: number) {
    const children = this.getChildren()
    
    const tasks: ThreadGenerator[] = []

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const txt = child.children()[0] as Txt
      tasks.push(txt.opacity(1, duration))
    }

    yield* all(...tasks)
  }
}
