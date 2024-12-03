import { Rect, RectProps, signal, Txt } from '@motion-canvas/2d'
import { createRef, SignalValue, SimpleSignal } from '@motion-canvas/core'

const spacing = 12
const size = 128
const fontSize = 64

export interface MemoryProps extends RectProps {
  keys: SignalValue<string[]>
  values: SignalValue<string[]>
}

export class Memory extends Rect {
  @signal()
  public declare readonly keys: SimpleSignal<string[], this>

  @signal()
  public declare readonly values: SimpleSignal<string[], this>

  al = createRef<Rect>()
  vl = createRef<Rect>()

  constructor(props: MemoryProps) {
    super({
      layout: true,
      padding: spacing,
      gap: spacing,
      radius: spacing,
      ...props,
    })

    this.add(
      <Rect layout direction={'column'} ref={this.al} gap={spacing}></Rect>
    )

    for (const keys of this.keys()) {
      this.al().add(
        <Rect padding={[spacing * 2, spacing * 4]} radius={spacing} fill={'#202020'} justifyContent={'center'}>
          <Txt text={keys} fontSize={fontSize} fontFamily={'JetBrains Mono'} fill={'white'}></Txt>
        </Rect>
      )
    }

    this.add(
      <Rect layout direction={'column'} ref={this.vl} gap={spacing}></Rect>
    )

    for (const values of this.values()) {
      this.vl().add(
        <Rect padding={[spacing * 2, spacing * 4]} radius={spacing} fill={'#202020'} justifyContent={'center'}>
          <Txt text={values} fontSize={fontSize} fontFamily={'JetBrains Mono'} fill={'white'}></Txt>
        </Rect>
      )
    }
  }
}