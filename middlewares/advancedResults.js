const advancedResults = (model, populate) => async (req, res, next) => {
  let data;
  //Faz uma copia de req.query
  let query = { ...req.query };

  //Lista de campos para serem 'excluidos' das rotas
  const removeFields = ["select", "sort", "page", "limit"];

  //Faz um loop por removeFields e remove eles de query
  removeFields.forEach(param => delete query[param]);

  //Pega query como objeto e converte para string
  //Usa regex para criar um operador se conter alguns dos valores informados
  //Fazendo com que filtering funcione perfeitamente
  let queryStr = JSON.stringify(query).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );
  //Encontra informações do recursos de acordo com queryStr ou retorna todos os recursos caso não acha nenhum filter.
  //Faz o populate de acordo com o recurso passado
  data = model.find(JSON.parse(queryStr));

  // Seleciona campos caso aja o query select
  if (req.query.select) {
    //Substitui virgulas por espaços
    const selecetValues = req.query.select.split(",").join(" ");
    data = data.select(selecetValues);
  }
  //Faz o sorting caso sort seja um query senão o sorting é feito pela data
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    data = data.sort(sortBy);
  } else {
    data = data.sort("-createdAt");
  }

  //Paginação
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  data = data.skip(startIndex).limit(limit);

  //Se populate for passado como parametro
  if (populate) {
    data = data.populate(populate);
  }

  //Executing the action
  const results = await data;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
