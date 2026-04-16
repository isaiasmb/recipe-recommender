type BgImageProps = {
  imagePath: string
}
const BgImage = ({ imagePath }: BgImageProps) => {
  return (
    <div
      aria-hidden
      className={`min-h-0 flex-1 rounded-md bg-[url('/${imagePath}')] bg-contain bg-center bg-no-repeat opacity-[0.02] dark:opacity-[0.07]`}
    />
  )
}

export default BgImage
