// Write your code here
import {withRouter, Redirect} from 'react-router-dom'
import {Component} from 'react'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    data: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await response.json()
    const formattedData = {
      id: data.id,
      imageUrl: data.image_url,
      description: data.description,
      availability: data.availability,
      similarProducts: data.similar_products,
      brand: data.brand,
      rating: data.rating,
      price: data.price,
      title: data.title,
      totalReviews: data.total_reviews,
    }

    if (response.ok === true) {
      this.setState({
        data: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderData = () => {
    const {data, quantity} = this.state
    const {
      similarProducts,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      imageUrl,
      brand,
    } = data
    const incrementQuantity = () => {
      this.setState(prevState => ({quantity: prevState.quantity + 1}))
    }
    const decrementQuantity = () => {
      if (quantity > 1) {
        this.setState(prevState => ({quantity: prevState.quantity - 1}))
      }
    }

    return (
      <div>
        <Header />
        <img src={imageUrl} alt="product" />
        <h1>{title}</h1>
        <p>{price}</p>
        <p>{rating}</p>
        <p>{totalReviews}</p>
        <p>{description}</p>
        <p>{availability}</p>
        <p>{brand}</p>
        <ul>
          {similarProducts !== undefined
            ? similarProducts.map(item => (
                <li key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.rating}</p>
                  <p>{item.price}</p>
                  <img
                    src={item.image_url}
                    alt={`similar product ${item.title}`}
                  />
                  <p>{item.brand}</p>
                </li>
              ))
            : ''}
        </ul>
        <button testid="plus" onClick={incrementQuantity} type="button">
          <BsPlusSquare />
        </button>
        <p>{quantity}</p>
        <button testid="minus" onClick={decrementQuantity} type="button">
          <BsDashSquare />
        </button>
        <button type="button">ADD TO CART</button>
      </div>
    )
  }

  renderFailureView = () => {
    const {history} = this.props
    const goToProducts = () => {
      history.push('/products')
    }
    return (
      <div>
        <Header />
        <h1>Product Not Found</h1>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
        />
        <button onClick={goToProducts} type="button">
          Continue Shopping
        </button>
      </div>
    )
  }

  renderLoader = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderData()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
}

export default withRouter(ProductItemDetails)
