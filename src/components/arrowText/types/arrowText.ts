enum EArrowTextType {
  singleArrow = 'singleArrow',
  doubleArrow = 'doubleArrow'
}

interface IArrowText {
  text: string
  type: EArrowTextType
}

export { EArrowTextType }
