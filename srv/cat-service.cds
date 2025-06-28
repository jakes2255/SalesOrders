using my.bookshop as bs from '../db/schema';

service CatalogService {
  entity Books @readonly as projection on bs.Books;
  entity Authors @readonly as projection on bs.Authors;
  entity Orders @insertonly as projection on bs.Orders;
  entity CatServ @readonly as projection on bs.CatalogService;
}
