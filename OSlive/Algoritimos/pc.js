function PC (Processos){
	this.listaProcessos = Processos;
	this.listaFinalizados = [];
	
	this.listaProcessos.sort( function(a,b){
		return a.chegada <= b.chegada;
	});

	this.vazio = function(){
		if(this.listaProcessos.length ==0){
			return true;
		}
	
		return false;
	}

	this.processosPorTempo = function(tempo){
		var n = this.listaProcessos.length;
		var retorno = [];
		
		for(var i=n-1; i>=0 && this.listaProcessos[i].chegada <= tempo; i--){
			retorno.push(this.listaProcessos.pop());
		}

		return retorno;
	}

	this.addfinalizado = function(p){
		this.listaFinalizados.push(p);
	}

	this.tabelaResultado = function(){
		var resultado = [];
		var aux;
		var espMed=0;
		var execMed=0;
		var turnMed =0;

		for(i in this.listaFinalizados){
			aux = this.listaFinalizados[i];
			espMed += aux.tempoEspera;
			execMed += aux.execucao;
			turnMed += aux.tempoEspera + aux.execucao;
			resultado.push({nome:aux.nome, espera: aux.tempoEspera, execucao: aux.execucao, turn: aux.tempoEspera + aux.execucao});
		}

		espMed = parseFloat((espMed/this.listaFinalizados.length).toFixed(2));
		execMed = parseFloat((execMed/this.listaFinalizados.length).toFixed(2));
		turnMed = parseFloat((turnMed/this.listaFinalizados.length).toFixed(2));
		resultado.push({nome:"Média",espera: espMed, execucao: execMed, turn: turnMed});
		return resultado;
	}

}