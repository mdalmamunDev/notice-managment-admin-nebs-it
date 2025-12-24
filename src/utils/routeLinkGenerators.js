export const routeLinkGenerators = (items, userRole) => {
  const links = items.reduce((acc, item) => {
    // Skip item if user doesn't have permission
    if (item.role && !item.role.includes(userRole)) {
      return acc;
    }

    // Normal item
    if (item.path && item.name) {
      acc.push({
        name: item.name,
        path: item.path,
        icon: item.icon,
      });
    }

    // Children items (nested)
    if (item.children) {
      const filteredChildren = item.children
        .filter(
          (child) =>
            (!child.role || child.role.includes(userRole)) && // role check
            child.path &&
            child.name &&
            child.icon
        )
        .map((child) => ({
          subName: child.name,
          subPath: child.path,
          subIcon: child.icon,
        }));

      if (filteredChildren.length > 0) {
        acc.push({
          name: item.name,
          icon: item.icon,
          rootPath: item.rootPath,
          children: filteredChildren,
        });
      }
    }

    return acc;
  }, []);

  return links;
};
