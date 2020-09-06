import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const Grades = db.gradesModel;

const create = async ({body:{name, subject, type, value, lastModified}}, res) => {
  const grades = new Grades({name, subject, type, value, lastModified});
    
  try {
      const data = await grades.save();
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify(data)}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const data = await grades.find({condition});
    logger.info(`GET /grade`);
    if(!data){
      res.status(400).send('Grade não encontrada');
    } else{
      res.send(data);
    }

  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await gradesModel.findOne({_id:id});

    if(!data){
      res.status(400).send('Grade não encontrada');
    } else{
      res.send(data);
    }
    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const data = await gradesModel.findByIdAndUpdate({_id:id}, req.body, {
      new: true,
    });

    if(!data){
      res.status(400).send('Grade não encontrada');
    } else{
      res.send(data);
    }

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {

    const data = await gradesModel.findByIdAndRemove({_id:id});

    if(!data){
      res.status(400).send('Grade não encontrada');
    } else{
      res.send(data);
    }

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    const data = await gradesModel.deleteMany();

    if(!data){
      res.status(400).send('Grade não encontrada');
    } else{
      res.send(data);
    }

    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
