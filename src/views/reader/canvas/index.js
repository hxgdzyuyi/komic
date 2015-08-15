import React from 'react'
import { Navigation } from 'react-router'
import $ from 'jquery'
import Backbone from 'backbone'

import app from 'app'
import routes from 'routes'

import VerticalAlignMiddle from 'widgets/vertical_align_middle'
import ImageManager from './image_manager'
import CanvasImage from './image'
import Loader from 'manager/loader'

export default class extends React.Component {

  constructor(options) {
    super(options)
    this.imageManger = new ImageManager()
    this.state = { loading: true }
    this.loader = new Loader()
  }

  componentWillReceiveProps() {
    this.state = {
      loading: !(this.loader.hasLoaded())
    }
    console.log('state', this.state)
  }

  componentWillMount() {
    var canvas = app.getModel('canvas')
    canvas.on('turn:nextPage', ::this.transitionToPage)
  }

  componentWillUnmount() {
    var canvas = app.getModel('canvas')
    canvas.off('turn:nextPage', ::this.transitionToPage)
  }

  transitionToPage() {
    var router = app.get('router')
      , canvas = app.getModel('canvas')
    router.transitionTo('page', { page: canvas.get('currentPage') })
  }

  scrollHandler(e) {
    this.imageManger[e.altKey ? 'onScaleScroll' : 'onMoveScroll'](e)
  }

  render() {

    var { loading } = this.state

    if (!loading) {
      return this.renderWithImage()
    } else {
      this.loader.loadOnRequest()
        .then(() => {
          this.setState({ loading: false})
        })
      console.log('state', this.state)
      return this.renderWithLoading()
    }

    return view
  }

  renderWithImage() {
    return (
      <div className="canvas" onWheel={ ::this.scrollHandler }>
        <CanvasImage manager={ this.imageManger } />
      </div>
    )
  }

  renderWithLoading() {
    return (
      <div className="canvas">
        <VerticalAlignMiddle style={
          { width: '100%', height: '100%', textAlign: 'center' }
          }>
          载入中
        </VerticalAlignMiddle>
      </div>
    )
  }

}
