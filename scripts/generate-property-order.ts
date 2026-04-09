/**
 * This script reads all TypeScript interfaces from src/interfaces/ and generates
 * a property order map. The map is used at runtime to reorder object properties
 * before XML serialization, ensuring elements are always in the correct order
 * regardless of how the user constructs the object.
 *
 * Run: npx ts-node scripts/generate-property-order.ts
 */

import { Project, InterfaceDeclaration, Type, ts } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, '..', 'tsconfig.json')
});

// Collect all exported interfaces from src/interfaces/
const interfaceFiles = project.getSourceFiles(path.resolve(__dirname, '..', 'src', 'interfaces', '*.ts'));

// Map: dotted path -> ordered property names
const propertyOrder: Record<string, string[]> = {};

// Map: dotted path -> referenced interface name(s), pipe-separated for unions
const propertyRefs: Record<string, string> = {};

function getPropertyNames(iface: InterfaceDeclaration): string[] {
  const names: string[] = [];
  // Include properties from extended interfaces first
  for (const baseType of iface.getBaseTypes()) {
    const baseSymbol = baseType.getSymbol();
    if (baseSymbol) {
      const baseDecls = baseSymbol.getDeclarations();
      for (const decl of baseDecls) {
        if (decl.getKindName() === 'InterfaceDeclaration') {
          for (const name of getPropertyNames(decl as InterfaceDeclaration)) {
            if (!names.includes(name)) {
              names.push(name);
            }
          }
        }
      }
    }
  }
  // Then add own properties
  for (const prop of iface.getProperties()) {
    const name = prop.getName();
    if (!names.includes(name)) {
      names.push(name);
    }
  }
  return names;
}

function getNamedInterfaceNames(type: Type): string[] {
  const names: string[] = [];
  const symbol = type.getSymbol() || type.getAliasSymbol();
  if (symbol) {
    for (const decl of symbol.getDeclarations()) {
      if (decl.getKindName() === 'InterfaceDeclaration') {
        names.push((decl as InterfaceDeclaration).getName());
      }
    }
  }
  return names;
}

function processType(type: Type, pathPrefix: string): void {
  // Unwrap union types - collect all named interface refs, or pick first object type for inline
  if (type.isUnion()) {
    const unionTypes = type.getUnionTypes();
    // Collect all named interface references from the union
    const allRefNames: string[] = [];
    let inlineObjectType: Type | undefined;
    for (const ut of unionTypes) {
      let checkType = ut;
      if (ut.isArray()) {
        checkType = ut.getArrayElementTypeOrThrow();
      }
      const names = getNamedInterfaceNames(checkType);
      if (names.length > 0) {
        allRefNames.push(...names);
      } else if (checkType.isObject() && !inlineObjectType) {
        inlineObjectType = checkType;
      }
    }
    if (allRefNames.length > 0) {
      if (pathPrefix.includes('.')) {
        propertyRefs[pathPrefix] = allRefNames.join('|');
      }
      return;
    }
    if (inlineObjectType) {
      type = inlineObjectType;
    } else {
      return;
    }
  }

  // Handle arrays - process the element type
  if (type.isArray()) {
    const elementType = type.getArrayElementTypeOrThrow();
    // Check if element type is a union of named interfaces
    if (elementType.isUnion()) {
      const unionTypes = elementType.getUnionTypes();
      const allRefNames: string[] = [];
      for (const ut of unionTypes) {
        const names = getNamedInterfaceNames(ut);
        allRefNames.push(...names);
      }
      if (allRefNames.length > 0 && pathPrefix.includes('.')) {
        propertyRefs[pathPrefix] = allRefNames.join('|');
        return;
      }
    }
    processType(elementType, pathPrefix);
    return;
  }

  if (!type.isObject()) return;

  // Check if this type is a named interface
  const ifaceNames = getNamedInterfaceNames(type);
  if (ifaceNames.length > 0) {
    if (pathPrefix.includes('.')) {
      propertyRefs[pathPrefix] = ifaceNames.join('|');
    }
    return;
  }

  // This is an inline/anonymous object type - extract its properties
  const properties = type.getProperties();
  if (properties.length === 0) return;

  const propNames = properties.map((p) => p.getName());
  propertyOrder[pathPrefix] = propNames;

  // Recurse into each property
  for (const prop of properties) {
    const propType = prop.getTypeAtLocation(prop.getDeclarations()[0]!);
    const childPath = `${pathPrefix}.${prop.getName()}`;
    processType(propType, childPath);
  }
}

// Process all exported interfaces
for (const sourceFile of interfaceFiles) {
  for (const iface of sourceFile.getInterfaces()) {
    if (!iface.isExported()) continue;

    const name = iface.getName();
    const propNames = getPropertyNames(iface);
    if (propNames.length === 0) continue;

    propertyOrder[name] = propNames;

    // Process each property to find nested types
    for (const prop of iface.getProperties()) {
      const propType = prop.getType();
      const childPath = `${name}.${prop.getName()}`;
      processType(propType, childPath);
    }

    // Also process properties from base interfaces
    for (const baseType of iface.getBaseTypes()) {
      const baseSymbol = baseType.getSymbol();
      if (baseSymbol) {
        const baseDecls = baseSymbol.getDeclarations();
        for (const decl of baseDecls) {
          if (decl.getKindName() === 'InterfaceDeclaration') {
            for (const prop of (decl as InterfaceDeclaration).getProperties()) {
              const propType = prop.getType();
              const childPath = `${name}.${prop.getName()}`;
              processType(propType, childPath);
            }
          }
        }
      }
    }
  }
}

// Generate output
const outputPath = path.resolve(__dirname, '..', 'src', 'generated', 'property-order.ts');

let output = `// AUTO-GENERATED FILE - DO NOT EDIT
// Generated by scripts/generate-property-order.ts
// Regenerate with: npm run generate:property-order

export const PROPERTY_ORDER: Record<string, string[]> = {\n`;

const sortedKeys = Object.keys(propertyOrder).sort();
for (const key of sortedKeys) {
  output += `  '${key}': [${propertyOrder[key].map((p) => `'${p}'`).join(', ')}],\n`;
}
output += `};\n\nexport const PROPERTY_REFS: Record<string, string> = {\n`;

const sortedRefKeys = Object.keys(propertyRefs).sort();
for (const key of sortedRefKeys) {
  output += `  '${key}': '${propertyRefs[key]}',\n`;
}
output += `};\n`;

fs.writeFileSync(outputPath, output);
console.log(`Generated property order map with ${sortedKeys.length} entries and ${sortedRefKeys.length} refs at ${outputPath}`);
