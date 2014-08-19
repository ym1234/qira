stream = io.connect(STREAM_URL);

function on_setiaddr(iaddr) { DS("setiaddr");
  Session.set("dirtyiaddr", true);
  Session.set('iaddr', iaddr);
} stream.on('setiaddr', on_setiaddr);

function on_setclnum(forknum, clnum) { DS("setclnum");
  Session.set('forknum', forknum);
  Session.set('clnum', clnum);
} stream.on('setclnum', on_setclnum);

Deps.autorun(function() { DA("set backend know iaddr changed");
  var iaddr = Session.get('iaddr');
  stream.emit('navigateiaddr', iaddr);
});

Template.controls.clnum = function() {
  return Session.get("clnum");
};

Template.controls.forknum = function() {
  return Session.get("forknum");
};

Template.controls.iaddr = function() {
  return Session.get("iaddr");
};

Template.controls.daddr = function() {
  return Session.get("daddr");
};

Template.controls.events = {
  'change #control_clnum': function(e) {
    Session.set("clnum", parseInt(e.target.value));
  },
  'change #control_forknum': function(e) {
    Session.set("forknum", parseInt(e.target.value));
  },
  'change #control_iaddr': function(e) {
    if (e.target.value == "") {
      Session.set("iaddr", undefined);
    } else {
      Session.set("iaddr", e.target.value);
      Session.set("dirtyiaddr", true);
    }
  },
  'change #control_daddr': function(e) {
    if (e.target.value == "") {
      Session.set("daddr", undefined);
      Session.set("dview", undefined);
    } else {
      update_dview(e.target.value);
    }
  },
  // removed for v1 since it was so broken
  /*'click #control_fork': function(e) {
    var clnum = Session.get("clnum");
    var forknum = Session.get("forknum");
    var pending = Session.get('pending');
    stream.emit('forkat', forknum, clnum, pending);
  },
  'click #control_changeeditor': function(e) {
    if (Session.get("showing_changeeditor") === true) {
      Session.set("showing_changeeditor", false);
      $('#changeeditor').hide();
      $('#control_changeeditor').css('background-color', '');
    } else {
      Session.set("showing_changeeditor", true);
      $('#changeeditor').show();
      $('#control_changeeditor').css('background-color', '#FF8888');
    }
  },*/
};

// keyboard shortcuts
window.onkeydown = function(e) {
  //p(e.keyCode);
  //p(e);
  if (e.keyCode == 37) {
    Session.set("forknum", Session.get("forknum")-1);
  } else if (e.keyCode == 39) {
    Session.set("forknum", Session.get("forknum")+1);
  } else if (e.keyCode == 38) {
    Session.set("clnum", Session.get("clnum")-1);
  } else if (e.keyCode == 40) {
    Session.set("clnum", Session.get("clnum")+1);
  } else if (e.keyCode == 77) {  // m -- end of function
    stream.emit('navigatefunction', Session.get("forknum"), Session.get("clnum"), false);
  } else if (e.keyCode == 188) {  // , -- start of function
    stream.emit('navigatefunction', Session.get("forknum"), Session.get("clnum"), true);
  } else if (e.keyCode == 90) {  // z
    zoom_out_max();
  } else if (e.keyCode == 74) {  // vim down, j
    go_to_flag(true, false);
  } else if (e.keyCode == 75) {  // vim up, k
    go_to_flag(false, false);
  } else if (e.keyCode == 85) {  // vim down, row up, data, u
    go_to_flag(true, true);
  } else if (e.keyCode == 73) {  // vim up, row up, data, i
    go_to_flag(false, true);
  } else if (e.keyCode == 27) {  // esc
    history.back();
  } else if (e.keyCode == 67 && e.shiftKey == true) {
    // shift-C = clear all forks
    delete_all_forks();
  }
};

$(document).ready(function() {
  $('body').on('click', '.clnum', function(e) {
    Session.set('clnum', parseInt(e.target.innerHTML));
  });
  $('body').on('click', '.iaddr', function(e) {
    Session.set('iaddr', e.target.innerHTML);
  });
  $('body').on('click', '.hdatamemory', function(e) {
    update_dview(e.target.innerHTML);
  });
  $('body').on('click', '.hdatainstruction', function(e) {
    update_dview(e.target.innerHTML);
  });
  $('body').on('dblclick', '.datamemory', function(e) {
    update_dview(e.target.innerHTML);
  });
  $('body').on('dblclick', '.datainstruction', function(e) {
    update_dview(e.target.innerHTML);
  });
  $('body').on('contextmenu', '.datainstruction', function(e) {
    Session.set("iaddr", e.target.innerHTML);
    Session.set("dirtyiaddr", true);
    return false;
  });
  $('body').on('click', '.flag', function(e) {
    var forknum = parseInt(e.target.parentNode.id.substr(9));
    var clnum = parseInt(e.target.innerHTML);
    Session.set("forknum", forknum);
    Session.set("clnum", clnum);
  });
  $('body').on('contextmenu', '.hdatainstruction', function(e) {
    Session.set("iaddr", e.target.innerHTML);
    Session.set("dirtyiaddr", true);
    return false;
  });
  $('body').on('click', '.data', function(e) {
    var daddr = e.target.getAttribute('id').split("_")[1];
    Session.set('daddr', daddr);
  });
  $('body').on('mousedown', '.datamemory', function(e) { return false; });
  $('body').on('mousedown', '.datainstruction', function(e) { return false; });
});

