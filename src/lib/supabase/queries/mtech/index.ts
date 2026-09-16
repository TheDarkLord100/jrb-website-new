// Barrel for the M.Tech query layer, split by domain now that the combined
// file passed ~1000 lines. Each file owns one table (or a table plus its
// tightly-coupled join table, e.g. baskets + basket_courses). _shared.ts
// holds the one internal type genuinely needed by two files
// (specializations.ts and specializationItems.ts) -- everything else stays
// local to the file that uses it.
//
// This barrel is what src/lib/supabase/queries/index.ts's
// `export * from './mtech'` actually resolves to (a folder with an
// index.ts resolves the same as a single mtech.ts would have) -- so no
// other file needed to change for this split.
export * from './content';
export * from './courses';
export * from './baskets';
export * from './specializations';
export * from './specializationItems';
export * from './specializationConstraints';