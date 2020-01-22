import React from 'react'
import './../support/css/footer.css'

class Footer extends React.Component {
    render() {
        return (

        <footer  id="footer"  className="page-footer font-small special-color-dark pt-4">
        <div className="footer-copyright text-center py-3">INI FOOTER
        </div>
        <div className="container-fluid">
          <ul className="list-unstyled list-inline text-center">
            <li className="list-inline-item">
              <a className="btn-floating btn-fb mx-1" href="https://www.google.com">
                <i className="fab fa-facebook-f"> </i>
              </a>
            </li>
            <li className="list-inline-item">
              <a className="btn-floating btn-tw mx-1" href="https://www.google.com">
                <i className="fab fa-twitter"> </i>
              </a>
            </li>
            <li className="list-inline-item">
              <a className="btn-floating btn-gplus mx-1" href="https://www.google.com">
                <i className="fab fa-google-plus-g"> </i>
              </a>
            </li>
            <li className="list-inline-item">
              <a className="btn-floating btn-li mx-1" href="https://www.google.com">
                <i className="fab fa-linkedin-in"> </i>
              </a>
            </li>
          </ul>
        </div>
      </footer>
        )
    }
}

export default Footer