import * as React from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
}

class AppComponent extends React.Component<Props, any> {
  render() {
    return (
      <div className={this.props.className}>
        <header>Full Stack Project</header>
        <main>main</main>
        <footer>footer</footer>
      </div>
    )
  }
}

export const App = styled(AppComponent)``
