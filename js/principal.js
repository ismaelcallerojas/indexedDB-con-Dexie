import prodb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./modulos.js";

let db = prodb("almacen", {
  productos: '++id, Nombre, Vendedor, Precio, Cantidad',
  clientes: '++id, Nombres, ci, telefono',
  usuarios: '++id, user, password'
});

// cajas de texto
const userid = document.getElementById("userid");
const proNombre = document.getElementById("proNombre");
const Vendedor = document.getElementById("Vendedor");
const Precio = document.getElementById("Precio");
const Cantidad = document.getElementById("Cantidad");

// botones
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

btnread.onclick = table;

// lista de eventos de los botones

btncreate.onclick = event => {
  var nombre=document.getElementById("proNombre");
  var vendedor=document.getElementById("Vendedor");
  var precio = document.getElementById("Precio");
  var cantidad = document.getElementById("Cantidad");
  if (nombre.value=="" || vendedor.value=="" || precio.value=="" || cantidad.value=="") {
    alert("Deben Ingresar todos los datos");
  }
  else {
      // insertar valores
      let flag = bulkcreate(db.productos, {
        Nombre: proNombre.value,
        Vendedor: Vendedor.value,
        Precio: Precio.value,
        Cantidad: Cantidad.value
      });
      
      proNombre.value = Vendedor.value = Precio.value = Cantidad.value = "";

      // autoincrementar el value de la caja de texto del id
      getData(db.productos, data => {
        userid.value = data.id + 1 || 1;
      });
      table();

      let insertmsg = document.querySelector(".insertmsg");
      getMsg(flag, insertmsg);
      // event listerner for create button
      btnread.onclick = table;
    }
  }


// boton actualizar
btnupdate.onclick = () => {
  var nombre=document.getElementById("proNombre");
  var vendedor=document.getElementById("Vendedor");
  var precio = document.getElementById("Precio");
  var cantidad = document.getElementById("Cantidad");
  if (nombre.value=="" || vendedor.value=="" || precio.value=="" || cantidad.value=="") {
    alert("Deben Ingresar todos los datos");
  }
  else {

  const id = parseInt(userid.value || 0);
  if (id) {
    // call dexie update method
    db.productos.update(id, {
      Nombre: proNombre.value,
      Vendedor: Vendedor.value,
      Precio: Precio.value,
      Cantidad: Cantidad.value
    }).then((updated) => {
      
      let get = updated ? true : false;

      // Mostrar Mensaje
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      proNombre.value = Vendedor.value = Precio.value = Cantidad.value = "";
      btnread.onclick = table;
    })
  } else {
    console.log('Selecciona id: ${id}');
  }
}}

// boton borrar
btndelete.onclick = () => {
  db.delete();
  db = prodb("almacen", {
    productos: '++id, Nombre, Vendedor, Precio, Cantidad'
  });
  db.open();
  table();
  textID(userid);
  // display message
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  // set id textbox value
  textID(userid);
};




// crear tabla dinamica
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  // remove all childs from the dom first
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.productos, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.Precio === data[value] ? `Bs. ${data[value]}` : data[value];
          });
        }
        //boton editar
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = editbtn;
          });
        })
        //boton eliminar
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute('data-id', data.id);
            // store number of edit buttons
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "No se encontró ningún registro en la base de datos....!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.productos.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    proNombre.value = newdata.Nombre || "";
    Vendedor.value = newdata.Vendedor || "";
    Precio.value = newdata.Precio || "";
    Cantidad.value = newdata.Cantidad || "";
  });
}

// boton borrar de la tabla 
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.productos.delete(id);
  table();
}

// caja de texto
function textID(textboxid) {
  getData(db.productos, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

// funcion mensaje
function getMsg(flag, element) {
  if (flag) {
    // call msg 
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}