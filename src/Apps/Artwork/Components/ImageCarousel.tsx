import React from "react"
import styled from "styled-components"

import Icon from "Components/Icon"
import { Arrow } from "Styleguide/Elements/Arrow"
import { Responsive } from "Utils/Responsive"

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Spacer = styled.div`
  display: flex;
  flex-grow: 1;
`

const BaseImageArea = styled.div.attrs<{ aspectRatio: number }>({})`
  line-height: 0; /* Don’t introduce visual margins */
  width: 100%;
  display: flex;
  flex-direction: row;
`

const SmallImageArea = styled(BaseImageArea)`
  max-height: calc(100vh - 120px);

  /**
   * This will make sure the image area already exists prior to image loading
   * and the layout won’t jump later on, but it does rely on the current design
   * where this image is supposed to be shown from the left side of the screen
   * to the right side of the screen, i.e. the width of the viewport.
   */
  height: calc(100vw / ${({ aspectRatio }) => aspectRatio});
`

const LargeImageArea = styled(BaseImageArea)`
  min-height: 450px;
  height: calc(100vh - 160px);
`

const ImageContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const BaseImage = styled.img`
  cursor: zoom-in;
  max-width: 100%;
`

const SmallImage = styled(BaseImage)`
  max-height: calc(100vh - 120px);
`

const LargeImage = styled(BaseImage)`
  max-height: 100%;
`

// TODO: Should Icon have this styling by default?
const Button = styled.a`
  ${Icon /* sc-selector */} {
    vertical-align: middle;
  }
`

const NavigationButtonContainer = styled.div`
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const PageIndicator = styled.span`
  &::after {
    content: "•";
  }

  color: ${({ isHighlighted }: { isHighlighted: boolean }) =>
    isHighlighted ? "#000" : "#d8d8d8"};
`

const BaseControlsContainer = styled.div`
  display: flex;
  justify-content: center;
`

const SmallControlsContainer = styled(BaseControlsContainer)`
  height: 60px;
  flex-direction: row-reverse;
`

const LargeControlsContainer = styled(BaseControlsContainer)`
  height: 80px;
  flex-direction: column;
`

/**
 * Give items margin on both sides so they don’t hug the side on small screens
 * when the controls are shown next to each other, but also are still centered
 * on larger screens when they are shown above each other.
 */
const ControlsContainerItem = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
`

const ActionButtons = styled(ControlsContainerItem)``

const PageIndicatorsContainer = styled(ControlsContainerItem)`
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${PageIndicator} + ${PageIndicator} {
    margin-left: 5px;
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

interface ImageCarouselProps {
  images: Array<{ uri: string; aspectRatio: number }>
}

interface ImageCarouselState {
  currentImage: number
}

const PageIndicators: React.SFC<{
  size: number
  highlightIndex: number
  onSelect: (index: number) => void
}> = ({ size, highlightIndex, onSelect }) => (
  <PageIndicatorsContainer>
    {[...new Array(size)].map((_, i) => (
      <PageIndicator
        key={i}
        isHighlighted={i === highlightIndex}
        onClick={() => onSelect(i)}
      />
    ))}
  </PageIndicatorsContainer>
)

const NavigationButton: React.SFC<{
  direction: "left" | "right"
  onClick: () => void
}> = ({ direction, onClick }) => (
  <NavigationButtonContainer>
    <Button
      href="#"
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      <Arrow direction={direction} fontSize="24px" />
    </Button>
  </NavigationButtonContainer>
)

export class ImageCarousel extends React.Component<
  ImageCarouselProps,
  ImageCarouselState
> {
  state = {
    currentImage: 0,
  }

  changeCurrentImage(by: number) {
    this.setState({
      currentImage: (this.state.currentImage + by) % this.props.images.length,
    })
  }

  render() {
    return (
      <Responsive>
        {({ xs }) => {
          const hasMultipleImages = this.props.images.length > 1
          const showNavigation = !xs && hasMultipleImages

          const image = this.props.images[this.state.currentImage]

          const Image = xs ? SmallImage : LargeImage
          const ImageArea = xs ? SmallImageArea : LargeImageArea
          const ControlsContainer = showNavigation
            ? LargeControlsContainer
            : SmallControlsContainer

          return (
            <Container>
              <ImageArea aspectRatio={image.aspectRatio}>
                {showNavigation && (
                  <NavigationButton
                    direction="left"
                    onClick={this.changeCurrentImage.bind(this, -1)}
                  />
                )}
                <ImageContainer>
                  <Image
                    src={image.uri}
                    // tslint:disable-next-line:no-console
                    onClick={() => console.log("Zoom")}
                  />
                </ImageContainer>
                {showNavigation && (
                  <NavigationButton
                    direction="right"
                    onClick={this.changeCurrentImage.bind(this, +1)}
                  />
                )}
              </ImageArea>
              <ControlsContainer>
                {hasMultipleImages && (
                  <PageIndicators
                    size={this.props.images.length}
                    highlightIndex={this.state.currentImage}
                    onSelect={i => this.setState({ currentImage: i })}
                  />
                )}
                {xs && <Spacer />}
                <ActionButtonsContainer>
                  <ActionButtons>
                    <Button href="#TODO">
                      <Icon name="heart" color="black" />
                    </Button>
                    <Button href="#TODO">
                      <Icon name="share" color="black" />
                    </Button>
                  </ActionButtons>
                </ActionButtonsContainer>
              </ControlsContainer>
            </Container>
          )
        }}
      </Responsive>
    )
  }
}
