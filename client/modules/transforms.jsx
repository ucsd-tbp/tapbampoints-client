/**
 * @file Higher-order components used across the application.
 * @see facebook.github.io/react/docs/higher-order-components.html
 */

import React from 'react';

/**
 * Page components are components that the router renders directly, and are
 * different from container components (which contain state and logic). To
 * avoid styling container components and mixing presentational (page)
 * components with container components in the router, only functional
 * presentational components should be routed to directly.
 *
 * However, some page components are very small, only adding a header and/or
 * a description before rendering some container component. To avoid adding
 * an entire file just for a small wrapper page compoment that renders a
 * container, this function takes a container component and returns a
 * component that wraps the container component with a header and optional
 * description.
 *
 * @param  {Component} ContainerComponent Container component to wrap.
 * @param  {string} header Header to display above the component.
 * @param  {string} description Description to display below the header.
 *
 * @return {Component} A functional presentational component that wraps the
 * container component with a header and optional description.
 */
export default function withSimplePresentation(ContainerComponent, header, description) {
  return (props) => (
    <div>
      {header && <h3>{header}</h3>}
      {description && <p>{description}</p>}
      <ContainerComponent {...props} />
    </div>
  );
}
