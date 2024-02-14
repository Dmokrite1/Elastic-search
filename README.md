```bash
echo "ATTENTION: si fonctionne pas dans le terminal bash aller directement dans l'exec du container docker et écrire la commande à partir de /usr !!"

# commandes d'installation elastic search
docker network create elastic-search

# setup et lance un container
docker run -p 9200:9200 -p 9300:9300 -d  --net elastic-search --name=cours-elastic -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.12.1

# setup le mdp; si fonctionne pas dans le terminal bash aller directement dans l'exec du container docker et écrire la commande à partir de /usr !!
docker exec -it cours-elastic /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
 # mdp : IJ9DMkHrIcgDQgHNwsws


# copie le certificat pour http; si fonctionne pas dans le terminal bash aller directement dans l'exec du container docker et écrire la commande à partir de /usr !!
 docker cp cours-elastic:/usr/share/elasticsearch/config/certs/http_ca.crt .

# lié avec mdp 
curl --cacert http_ca.crt -u elastic https://localhost:9200/

# interface graphique, visualisation de données
docker pull docker.elastic.co/kibana/kibana:8.12.1

# lance le serveur kibana dans le réseau elastic
docker run -d --name cours-kibana --net elastic-search -p 5601:5601 docker.elastic.co/kibana/kibana:8.12.1

# launch le localhost kibana est entrée le token dans l'interface graphique; si fonctionne pas dans le terminal bash aller directement dans l'exec du container docker et écrire la commande à partir de /usr !!

# launch la commande pour recevoir le code verification : 789071
docker exec -it cours-kibana /usr/share/kibana/bin/kibana-verification-code

# une fois reçu entrée user: elastic et le mdp reçu : IJ9DMkHrIcgDQgHNwsws
# request dans management/devtools sur kibana = localhost
GET /_cluster/health  #montre la santé et les infos du cluster
GET /_cat/nodes?v  #montre la ram, le cpu, l'ip etc
GET /_cat/indices?v  #montre les tables
PUT /inventory  #créée une table
POST /inventory/_doc  #insére des données dans la table inventory
{
  "item": "Chocolate",
  "quantity": 100,
  "price": 14.99,
  "description": "A box with a lot of chocolate",
  "status": "active",
  "origin": "BE",
  "tags": [
    "health",
     "food"]
}

# donne une id
POST /inventory/_doc/mon_id
{
  "item": "Tuna",
  "quantity": 50,
  "price": 10,
  "description": "tuna",
  "status": "active",
  "origin": "SW",
  "tags": [
    "health",
    "food",
    "fish"
    ]
}

# récupère par id
GET /inventory/_doc/mon_id

# update, en internet une maj est un remplacement car les documents sont immutables
#si rien n'est modifié lors de l'update result = "noop"
POST /inventory/_update/mon_id
{
  "doc": {
    "description": "A box of tuna"
  }
}

# possibilité d'écrire du script
#script basique ici fais +1 à la quantité
POST /inventory/_update/mon_id
{
  "script": {
    "source": "ctx._source.quantity++"
  }
}

# choisir la valeur à incrémenter
POST /inventory/_update/Store2
{
  "script": {
    "source": "ctx._source.numberEmployed += params.numberEmployed",
    "params": {
      "quantity": 5
    }
  }
}

# choisir la valeur à incrémenter (même chose qu'au dessus mais syntaxiquement plus court)
POST /inventory/_update/mon_id
{
  "script": {
    "source": "ctx._source.quantity += 5"
  }
}

# update ou insert si inexistant; si existant script pris en compte et si pas existant passe à l'upsert sans jouer le script
POST /inventory/_update/Store2
{
  "script": {
    "source": "ctx._source.quantity =0"
  },
  "upsert": {
    "item": "tasse de thé",
    "quantity": 40,
    "price": 5,
    "description": "a cup of tea"
  }
}

# remplacé un document en entier
PUT /inventory/_doc/123456
{
  "item": "tasse de café",
  "quantity": 10,
  "unit": "gr",
  "description": "garde réveiller"
}

# delete du document
DELETE /inventory/_doc/123456

# drop table
DELETE /inventory

# Empêcher deux POST en même temps de modifié le document avec le même number: seq_no
POST /store/_update/Store1?if_primary_term=1&if_seq_no=11
{
  "doc": {
    "nameStore": "Potatoz"
  }
}

# permet de faire des maj sur plusieurs documents à la fois: match_all
POST /store/_update_by_query
{
  "script": {
    "source": "ctx._source.numberEmployed += 5"
  },
  "query": {
    "match_all": {}
  }
}

# supprimé plusieurs éléments ou documents, ici tous les documents de store
POST /store/_delete_by_query
{
    "query": {
        "match_all": {}
    }
}

# bulk permet d'update partiellement le document
POST _bulk
{ "index" : { "_index" : "inventory"  }}
{ "item" : "Oreiller", "quantity" : 1, "price" : 0, "description" : "Oreiller de Sébastien, il y a quelques taches blanches ..." }
{ "create" : { "_index" : "inventory"  }}
{ "item" : "Croix", "quantity" : 1, "price" : 100, "description" : "Une croix, sans religion" }

POST /inventory/_bulk
{ "index" : { "_id": "501"  }}
{ "item" : "Oreiller", "quantity" : 1, "price" : 0, "description" : "Oreiller de Sébastien, il y a quelques taches blanches ..." }
{ "create" : { "_id": "502"  }}
{ "item" : "Croix", "quantity" : 1, "price" : 100, "description" : "Une croix, sans religion" }

POST /inventory/_bulk
{ "update" : { "_id": "502"  }}
{ "doc": { "item" : "Croix 2"} }

POST /inventory/_bulk
{ "delete" : {"_id": "502"  }}

# exercice créer 5 magasins METHOD 1
POST _bulk
{ "index" : { "_index" : "store" }}
{ "nameStore": "leTruc", "numberEmployed": 5, "address": "là-bas1" }
{ "index" : { "_index" : "store"}}
{ "nameStore": "leTruc1", "numberEmployed": 5, "address": "là-bas2" }
{ "index" : { "_index" : "store" }}
{ "nameStore": "leTruc2", "numberEmployed": 5, "address": "là-bas3" }
{ "index" : { "_index" : "store"}}
{ "nameStore": "leTruc3", "numberEmployed": 5, "address": "là-bas4" }
{ "index" : { "_index" : "store"}}
{ "nameStore": "leTruc4", "numberEmployed": 5, "address": "là-bas5" }

# exercice créer 5 magasins METHOD moins verbeuse
POST /store/_bulk
{ "index" : { "_index" : "store" }}
{ "nameStore": "leTruc", "numberEmployed": 5, "address": "là-bas1" }
{ "nameStore": "leTruc1", "numberEmployed": 5, "address": "là-bas2" }
{ "nameStore": "leTruc2", "numberEmployed": 5, "address": "là-bas3" }
{ "nameStore": "leTruc3", "numberEmployed": 5, "address": "là-bas4" }
{ "nameStore": "leTruc4", "numberEmployed": 5, "address": "là-bas5" }

# ici avec Create
POST _bulk
{ "create" : {}}
{ "nameStore": "leTruc", "numberEmployed": 5, "address": "là-bas1" }
{ "create" : {}}
{ "nameStore": "leTruc1", "numberEmployed": 5, "address": "là-bas2" }
{ "create" : {}}
{ "nameStore": "leTruc2", "numberEmployed": 5, "address": "là-bas3" }
{ "create" : {}}
{ "nameStore": "leTruc3", "numberEmployed": 5, "address": "là-bas4" }
{ "create" : {}}
{ "nameStore": "leTruc4", "numberEmployed": 5, "address": "là-bas5" }

# les recherches sont faites sur le texte, le tokenizer et le token filter et pas sur l'onjet json en voici différents exemples
POST _analyze
{
  "analyzer": "standard",
  "text": "The 2 QUICK Brown-Foxes jumped over the lazy dog's bone."
}

PUT /standard_example
{
  "settings": {
    "analysis": {
      "analyzer": {
        "rebuilt_standard": {
          "tokenizer": "standard",
          "filter": [
            "lowercase"       
          ]
        }
      }
    }
  }
}

PUT my-index-000001
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": { 
          "char_filter": [
            "emoticons"
          ],
          "tokenizer": "punctuation",
          "filter": [
            "lowercase",
            "english_stop"
          ]
        }
      },
      "tokenizer": {
        "punctuation": { 
          "type": "pattern",
          "pattern": "[ .,!?]"
        }
      },
      "char_filter": {
        "emoticons": { 
          "type": "mapping",
          "mappings": [
            ":) => happy",
            ":( => sad"
          ]
        }
      },
      "filter": {
        "english_stop": { 
          "type": "stop",
          "stopwords": "_english_"
        }
      }
    }
  }
}

POST my-index-000001/_analyze
{
  "analyzer": "my_custom_analyzer",
  "text": "I'm a :) person, and you?"
}


# mapping dynamic (conseiller de faire un mapping "strict"), properties définit un object et le 2ieme properties setup un object dans un object
PUT /users/
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "firstname": {
        "type": "text"
      },
      "lastname": {
        "type": "text"
      },
      "username": {
        "type": "text"
      },
      "email": {
        "type": "keyword"
      },
      "address": {
        "properties": {
          "city": {
            "type": "text"
          }
        }
      }
    }
  }
}

POST /users/_doc
{
  "firstname": "petite",
  "lastname": "huguette",
  "username": "beagle",
  "email": "address@gmail.com",
  "address": {
    "city": "Roubaix"
  }
}

PUT /users/_mapping
{
  "properties": {
    "createdAt": {
      "type": "date"
    }
  }
}

POST /users/_update_by_query
{
  "query": {
    "match_all": {}
  },
  "script": {
    "source": "ctx._source.createdAt = '1940-10-10'",
    "lang": "painless"
  }
}

GET /users/_search
{
  "query": {
    "match_all": {}
  }
}

PUT /users/_mapping
{
  "properties": {
    "updatedAt": {
      "type": "date",
      "format": "DD/MM/YY"
    }
  }
}

POST /users/_doc
{
  "updatedAt": "05/06/87"
}


# coerce est une option de configuration dans ElasticSearch qui indique si les valeurs doivent être converties automatiquement en cas de type incompatible lors de l'indexation.
PUT /users/_mapping
{
    "properties": {
      "age": {
        "type": "integer",
        "coerce": false
    }
  }
}

# pareil ici avec l'index
PUT /users/_mapping
{
    "properties": {
      "age": {
        "type": "integer",
        "index": false
    }
  }
}


# null_value permet de spécifier une valeur par défaut pour un champ lorsqu'il est null
PUT /users/_mapping
{
    "properties": {
      "age": {
        "type": "integer",
        "null_value": 100
    }
}


# ignore_above est utilisée pour spécifier la longueur maximale d'une chaîne de caractères à indexer.
PUT /users/
{
  "mappings": {
    "properties": {
      "size": {
        "type": "integer",
        "ignore_above": 256
      }
    }

# créer un new users et copier les données d'user dans users_new voir en dessous
PUT /users_new
{
  "mappings" : {
    "properties" : {
      "address" : {
        "properties" : {
          "city" : {
            "type" : "text"
          }
        }
      },
      "createdAt" : {
        "type" : "date"
      },
      "email" : {
        "type" : "keyword"
      },
      "username": {
        "type" : "keyword"
      },
      "firstName" : {
        "type" : "text"
      },
      "lastName" : {
        "type" : "text"
      }
    }
  }
}

# permet de copier tous les documents de l'index "users" vers un nouvel index appelé "users_new". Cela peut être utile lorsqu'on veut réindexer des données dans un nouvel index avec un nouveau mapping ou pour effectuer des opérations de maintenance sur les données.
POST /_reindex
{
  "source": {
    "index": "users"
  },
  "dest": {
    "index": "users_new"
  }
}

PUT /multi_fields_test
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  }
}


# configurer l'analyzer en précisant le setting sous default
PUT /users/
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": {
          "type": "french"
        }
      }
    }
  }
}

# exemple
PUT /users_temp
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": {
          "type": "french"
        }
      }
    }
  }
},
{
  "mappings" : {
    "properties" : {
      "address" : {
        "properties" : {
          "city" : {
            "type" : "text"
          }
        }
      },
      "createdAt" : {
        "type" : "date"
      },
      "email" : {
        "type" : "keyword"
      },
      "username": {
        "type" : "keyword"
      },
      "firstName" : {
        "type" : "keyword"
      },
      "lastName" : {
        "type" : "keyword"
      }
    }
  }
}

POST /_reindex
{
  "source": {
    "index": "users"
  },
  "dest": {
    "index": "users_temp"
  }
}

DELETE /users

# préciser l'analyzer
PUT /books/
{
  "mappings": {
    "properties": {
      "title" : {
        "type": "text",
        "analyzer": "french"
      }        
    }
  }
}


# créer son propre analyzer
PUT /standard_example
{
  "settings": {
    "analysis": {
      "analyzer": {
        "rebuilt_standard": {
          "tokenizer": "standard",
          "filter": [
            "lowercase"       
          ]
        }
      }
    }
  }
}

# exercice réaliser un mapping, en français avec des tags, un auteur, un titre français, un titre anglais, un contenu et une note global
PUT /article
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": {
          "type": "french"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "tags": {
        "type": "keyword"
      },
      "author": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "analyzer": "french"
          }
        }
      },
      "titre": {
        "type": "keyword"
      },
      "title": {
        "type": "text",
        "analyzer": "english",
      },
      "content": {
        "type": "text"
      },
      "note": {
        "type": "integer"
      }
    }
  }
}

#récupérez le mapping et insérer des articles dedans
POST /article/_doc/1
{
  "author": "John Doe",
  "titre": "Santé et bien-être",
  "title": "Health and Wellness",
  "content": "Les conseils pour maintenir une bonne santé incluent une alimentation équilibrée, de l'exercice régulier et suffisamment de sommeil.",
  "note": 4,
  "tags": ["santé", "alimentation"]
}

POST /article/_doc/2
{
  "author": "Jane Smith",
  "titre": "Les dernières innovations technologiques",
  "title": "The Latest Technological Innovations",
  "content": "Découvrez les dernières avancées en matière de technologie, y compris l'intelligence artificielle, l'Internet des objets et la réalité virtuelle.",
  "note": 5,
  "tags": ["innovations", "technologie"]
}

POST /article/_doc/3
{
  "author": "Alice Johnson",
  "titre": "Explorer le monde",
  "title": "Exploring the World",
  "content": "Des destinations exotiques aux aventures en plein air, découvrez les meilleurs endroits à visiter lors de votre prochain voyage.",
  "note": 4,
  "tags": ["explorer", "monde"]
}

GET /article

POST /_analyze
{
  "analyzer": "french",
  "text": "John"
}

GET /article/_search
{
  "query": {
    "match_all": {}
  }
}

GET /article/_search
{
  "query": {
    "term": {
      "tags": {
        "value": "alimentation"
      }
    }
  }
}

GET /article/_search
{
  "query": {
    "term": {
      "tags": {
        "value": ["alimentation", "explorer"]
      }
    }
  }
}

# rechercher à partir de plusieurs tags y compris dans plusieurs articles
GET /article/_search
{
  "query": {
    "terms": {
      "tags": ["alimentation", "explorer"]
    }
  }
}

# rechercher plusieurs articles via leurs ids
GET /article/_search
{
  "query": {
    "ids": {
      "values": ["1","2"]
    }
  }
}

# exemple ici d'une recherche sur un id 
GET /article/_doc/1

# recherche une note entre x et y
GET /article/_search
{
  "query": {
    "range": {
      "note": {
        "gte": 5,
        "lte": 8
      }
    }
  }
}

# recherche les champs existants dans le document
GET /article/_search
{
  "query": {
    "exists": {
      "field": "tags"
    }
  }
}

# recherche à partir du préfix
GET /article/_search
{
  "query": {
    "prefix": {
      "titre.keyword": "Sa"
    }
  }
}

# wilcard très couteux en performance à utilisé avec partimonie
GET /article/_search
{
  "query": {
    "wildcard": {
      "titre.keyword": "*S*"
    }
  }
}

# le score équivaut à la pertinence de la recherche plus il y aura de correspondance et plus le score sera élever
# recherche via un mot particulier possible de mettre plusieurs mots dans plusieurs articles
GET /article/_search
{
  "query": {
    "match": {
      "content":"exotiques, artificielle"
    }
  }
}

GET /article/_search
{
  "query": {
    "match": {
      "content": {
        "query": "exotiques et artificielle",
        "operator": "and"
      }
    }
  }
}

# recherche via deux mots ou plus dans un article
GET /article/_search
{
  "query": {
    "match": {
      "content": {
        "query": "exotiques voyage",
        "operator": "and"
      }
    }
  }
}

# multi-match recherche des mots clés dans plusieurs champs
GET /article/_search
{
  "query": {
    "multi_match": {
      "query": "monde et destination, Alice",
      "fields": ["titre","content", "author"]
    }
  }
}


# recherche sur le content + sur le term, should un seul des block doit matcher (or)
GET /article/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "content": "destinations"
          }
        },
        {
          "term": {
            "author.keyword": "Alice"
          }
        }
      ]
    }
  }
}

# must doit obligatoirement match pour être validé
GET /article/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "tags.keyword": "explorer"
          }
        }
      ],
      "must": [
        {
          "match": {
            "titre": "monde"
          }
        }
      ]
    }
  }
}

GET /article/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "titre": "monde"
          }
        }
      ]
    }
  }
}

PUT /department
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": {
          "type": "french"
        }
      }
    }
  }, 
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "employees": {
        "type": "nested",
        "properties": {
          "name": {
            "type": "text"
          },
          "gender": {
            "type":"keyword"
          },
          "position": {
            "type": "text"
          }
        }
      }
    }
  }
}

# recherche dans un objet nested, inner_hits recherche exactement ce qui a matché
GET /department/_search
{
  "query": {
    "inner_hits": {},
    "nested": {
      "path": "employees",
      "query": {
        "match": {
          "employees.position": "Développeur"
        }
      }
    }
  }
}

Delete /article
```