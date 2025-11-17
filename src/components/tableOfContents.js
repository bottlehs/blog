import React, { useMemo, useEffect, useRef } from 'react';
import cn from 'classnames';

const TableOfContents = ({ items, currentHeaderUrl }) => {
  const navRef = useRef(null);
  const contentsRef = useRef(null);

  const replaceItems = useMemo(() => {
    if (currentHeaderUrl) {
      return items.replace(
        `"${currentHeaderUrl}"`,
        `"${currentHeaderUrl}" class="isCurrent"`
      );
    } else {
      return items;
    }
  }, [currentHeaderUrl]);

  useEffect(() => {
    if (currentHeaderUrl && navRef.current && contentsRef.current) {
      const currentLink = contentsRef.current.querySelector('a.isCurrent');
      if (currentLink) {
        const nav = navRef.current;
        const linkRect = currentLink.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        const linkTop = linkRect.top - navRect.top + nav.scrollTop;
        const navHeight = nav.offsetHeight;
        const linkHeight = linkRect.height;
        const targetScrollTop = linkTop - (navHeight / 2) + (linkHeight / 2);

        nav.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [currentHeaderUrl]);

  return items ? (
    <nav ref={navRef} className={cn('table-of-contents', 'container')}>
      <h3 className={'title'}>Table of contents</h3>
      <div
        ref={contentsRef}
        className={'contents'}
        dangerouslySetInnerHTML={{ __html: replaceItems }}
      />
    </nav>
  ) : null;
}

export default TableOfContents
