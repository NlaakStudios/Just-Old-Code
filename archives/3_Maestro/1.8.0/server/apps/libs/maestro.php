<?php
/** 
 *   
 * @package     Maestro Server-Side 
 * @version     1.0.0 
 * @author      i2tm Labs http://i2tmlabs.com 
 * @copyright   Copyright (C) 2013 i2tm Labs 
 * @license     Private 
 **/

// Define framework version.   
define('_MAESTRO', 1);

/**
	Maestro Themed Icon Set
	color			rgb
	--------------------------------
	black			0,0,0		
	blue			0,0,255
	cyan			0,192,255
	green			0,255,0
	lavender		96,64,128
	neutral			127,127,127
	orange			255,128,0
	pink			240,220,230
	purple			150,0,255
	red				255,0,0
	tan				220,160,120
	teal			64,128,96
	yellow			192,192,0

*/
//Templating?
//$find = array('{VERPATH}', '{VERTYPE}');
//$value   = array($BASEPATH.'nano/'.$USE_NANO_VERSION, '.'.$USE_NANO_BUILD);
//$MAESTRO = str_replace($find, $value, $MAESTRO);

class MaestroCore
{	
	private $render = array('css'=>'','js'=>'','html'=>'');
	public $LAYOUTS = null;
	public $TEMPLATES = null;
	
	//holds all variables that are search & replace in template
	public $vars = array();
	public $publisher = "i2tm";				//$USE_PUB
	public $app = "apperror";				//$USE_APP
	public $build = "release";				//$USE_BUILD
	public $devMode = false;				//$DEVMODE
	
	public $console = array();	
	public $layout = '';
	public $params = null;
	public $doc = null;							//CloudApp JSON Config
	public $user = null;

    //browser objects    
    //public $browser;
    //public $platform;
    
    public static function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = New MaestroCore();
        }
        return $instance;
    }
    
	public function getVars() {
		return $this->vars;
	}

    public function __construct()
    {
		$this->publisher = (isset($_GET['pub']))?$_GET['pub']:"i2tm";				
		$this->app = (isset($_GET['app']))?$_GET['app']:"apperror";		
		$this->build =(isset($_GET['bld']))?$_GET['bld']:"release";					
		$this->devMode =($this->build=="release")?false:true;	
		error_reporting(E_ERROR);	
		$this->ERRORS=array();
		
		$this->TEMPLATES=array(
			'brushed',
			'cover',
			'justified-nav',
			'starter'
		);

		$this->LAYOUTS=array(
			'Blog'=>'blog.html',
			'Carousel'=>'carousel.html',
			'Cover Page'=>'coverpage.html',
			'Dashboard'=>'dashboard.html',
			'Default'=>'default.html',
			'Enhanced Nav Panel'=>'enhanced_nav_panel.html',
			'Floating Narrow'=>'example.floating-narrow.html',
			'Fixed Navigation & Footer'=>'fixed_nav_footer.html',
			'Jumbotron Narrow'=>'jumbotron-narrow.html',
			'Jumbotron Wide'=>'jumbotron-wide.html',
			'Marketing'=>'marketing.html',
			'Off Canvas'=>'offcanvas.html',
			'Showcase'=>'showcase.html',
			'Starter'=>'starter.html'
		);
							
		$this->doc = new MCloudAppCfg($this, $this->publisher, $this->app);				
		if ($this->devMode && $this->doc!=null)			
		$this->log(sprintf("Creating CloudApp %s [%s] v%s by %s",$this->doc->cfg['app']['fullname'],$this->build,$this->doc->cfg['app']['version'],$this->publisher));
		$this->initColors();
		$this->processBody();
		$this->vars['debug_obj'] = json_encode($this);
    }
	function log($msg) { array_push($this->console,$msg);}
	function initColors() {
		$s = $this->doc->cfg['app']['skin']; 
		$t = MaestroColor::getThemeColors($this->doc->cfg['app']['theme']);
		$this->vars['clrPri'] = 'rgba('.implode(",",$t[0]).',0.75)'; 		//Primary Color
		$this->vars['clrSha'] = 'rgba('.implode(",",$t[0]).',0.55)'; 		//Primary Color Shadow
		$this->vars['clrHig'] = 'rgba('.implode(",",$t[0]).',0.95)';		//Primary Color Highlight
		$this->vars['clrHov'] = 'rgba('.implode(",",$t[0]).',1.00)';		//Primary Color Hover

		//Theme Options [Dark, Medium, Light or Color] Default is Light
		if ( $s === 'dark') {			
			$this->vars['fcolor'] = 'rgba(221,221,221,.9)';
			$this->vars['scolor'] = 'rgba(0,0,0,.9)';
			
		} else if ($s === 'medium') {
			$this->vars['fcolor'] = 'rgba(160,160,160,.9)';
			$this->vars['scolor'] = 'rgba(96,96,96,.9)';
			
		} else if ($s === 'color') {
			$parr = MaestroColor::hex2rgb($this->vars['scolor']);
			
			///average
			$avg = ($parr[0]+$parr[1]+$parr[2])/3;
			
			//normalize
			$red= ($parr[0]+128)/2;
			$grn= ($parr[1]+128)/2;
			$blu= ($parr[2]+128)/2;
			
			if ($avg < 86) {
				//go lighter on font
				$red=floor($red*1.5); $grn=floor($grn*1.5); $blu=floor($blu*1.5); 
			} else if ($avg > 168) {
				//go darker on font
				$red=floor($red*0.5); $grn=floor($grn*0.5); $blu=floor($blu*0.5); 
			} else {
				//neutral go black
				$red=0; $grn=0; $blu=0;
			}
			
			$t[0] = $red.','.$grn.','.$blu;
			
			$this->vars['fcolor'] = 'rgba('.$t[0].',1.00)';
			$this->vars['scolor'] = 'rgba('.MaestroColor::hex2rgb($t[1],1).',1.00)';
			
		} else {
			$this->vars['fcolor'] = 'rgba(34,34,34,.9)';
			$this->vars['scolor'] = 'rgba(255,255,255,.9)';
		}
	}
	
	public function searchandreplace() {
		//$html = 
		foreach ($this->vars as $key => $value) {
			$find = ("{".$key."}");
			$this->layoutContents = str_replace($find, $value, $this->layoutContents );
		}
	}

	public function render($what) {
		if ($what=='css'&&$this->render['css']!='') 
			echo '<style id="'.$this->doc->cfg['app']['template'].'-CSS" rel="stylesheet" type="text/css">'.$this->render['css'].'</style>'; 
		else if ($what=='js'&&$this->render['js']!='') 
			echo '<script id="'.$this->doc->cfg['app']['template'].'-JS" type="application/javascript">/*<![CDATA[*/'.$this->render['js'].'/*]]>*/</script>';
		else if ($what=='html'&&$this->render['html']!='') 
			echo $this->render['html'];
		else return;
	}
	
	private function processBody() {
		$result = array();
		
		if (isset($this->doc->cfg['app']['template'])) {
			$template=strtolower($this->doc->cfg['app']['template']);
			$template=($template=='')?'default':$template;			
			$file = TEMPLATES.$template.'.html';
			//Load template HTML
			if (file_exists(TEMPLATES.$template.'.html')) {
				$this->render['html']=file_get_contents(TEMPLATES.$template.'.html');
			} else {
				$this->render['html']='<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Error</strong> '.$template.' is not a valid Template.</div>';    			
			}		
			//Load template STYLESHEET
			if (file_exists(TEMPLATES.$template.'.css')) {
				$this->render['css']=file_get_contents(TEMPLATES.$template.'.css');
			}		
			//Load template SCRIPT
			if (file_exists(TEMPLATES.$template.'.js')) {
				$this->render['js']=file_get_contents(TEMPLATES.$template.'.js');
			}		
		} else if (isset($this->doc->cfg['app']['layout'])) {
			$layout=strtolower($this->doc->cfg['app']['layout']);
			$layout=($layout=='')?'default':$layout;
			if (file_exists(LAYOUTS.$layout.'.html')) {
				$this->render['html']=file_get_contents(LAYOUTS.$layout.'.html');
			} else {
				$this->render['html']='<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Error</strong> '.$layout.' is not a valid Layout.</div>';    			
			}
		} else {
			//=-=|You must define either a TEMPLATE or LAYOUT|=-=//
			$this->render['html']='<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Error</strong> You must define either a TEMPLATE or LAYOUT.</div>';    			
		}	
	}    		

	/*
	public function customstyle() {
		$style = '
			<style>
			body {
				color: {fcolor};
				background-color: {scolor};
			}

			.row {
				max-width:{width};
			}

			::-webkit-scrollbar {width: .5em}
			::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 .25em rgba(0,128,0,0.3);-webkit-border-radius: .5em;border-radius: .5em}
			::-webkit-scrollbar-thumb {-webkit-border-radius: .5em;border-radius: .5em;background: rgba(0,128,0,0.8);-webkit-box-shadow: inset 0 0 .25em rgba(0,128,0,0.5)}
			::-webkit-scrollbar-thumb:window-inactive {background: rgba(0,128,0,0.4)}	
			
			a, h1, h2, h3, h4, h5, h6 {color:{clrPri};}
			
			a:hover 
			{color:{clrHov};}

			form input,
			form input:not([type]),
			form input[type=reset],
			form input[type=color],
			form input[type=email],
			form input[type=number],
			form input[type=range],
			form input[type=search],
			form input[type=datetime-local],
			form input[type=submit],
			form input[type=button],
			form input[type=file],
			form input[type=text],
			form input[type=url],
			form input[type=tel],
			form input[type=time],
			form input[type=week],
			form input[type=month],
			form input[type=password],
			form input.text,
			form select,
			form textarea{-webkit-appearance:none;display:block;border:0;outline-color:transparent;color:#0c0;background:#1F2f1f;box-shadow:inset 0 0 1px 0 #001000;border-radius:.35em;width:100%;-moz-transition:all .25s ease-in-out;-webkit-transition:all .25s ease-in-out;-o-transition:all .25s ease-in-out;-ms-transition:all .25s ease-in-out;transition:all .25s ease-in-out;padding:.25em}
			
			form input:hover,
			form input:not([type]):hover,
			form input[type=reset]:hover,
			form input[type=color]:hover,
			form input[type=email]:hover,
			form input[type=number]:hover,
			form input[type=range]:hover,
			form input[type=search]:hover,
			form input[type=datetime-local]:hover,
			form input[type=submit]:hover,
			form input[type=file]:hover,
			form input[type=button]:hover,
			form input[type=text]:hover,
			form input[type=url]:hover,
			form input[type=tel]:hover,
			form input[type=time]:hover,
			form input[type=week]:hover,
			form input[type=month]:hover,
			form input[type=password]:hover,
			form input.text:hover,
			form select:hover,
			form textarea:hover{color:#0f0;background:#3F4f3f}
			
			form input:focus,
			form input:not([type]):focus,
			form input[type=reset]:focus,
			form input[type=color]:focus,
			form input[type=email]:focus,
			form input[type=number]:focus,
			form input[type=range]:focus,
			form input[type=search]:focus,
			form input[type=datetime-local]:focus,
			form input[type=submit]:focus,
			form input[type=file]:focus,
			form input[type=button]:focus,
			form input[type=text]:focus,
			form input[type=url]:focus,
			form input[type=tel]:focus,
			form input[type=time]:focus,
			form input[type=week]:focus,
			form input[type=month]:focus,
			form input[type=password]:focus,
			form input.text:focus,
			form select:focus,
			form textarea:focus{color:#0c0;background:#6F8f6f}
			form textarea{min-height:10em}
			
			hr, 
			.alert-box,
			.top-bar-section .dropdown li label, 
			.panel.callout, 
			.button {
				border-color:{clrSha};
			}

			.button {
				background-color:{clrPri};
			}

			.button:hover {
				background-color:{clrHov};
			}
						
			.top-bar-section .dropdown li label 
			{color:white; background-color:{clrHig};}
			
			pre {
				text-align: left;
				font-family: 'Droid Sans Mono', Courier;
				padding: 10px 20px;
				background: rgba(255, 0, 0, 0.05);
				-webkit-border-radius: 8px;
				-khtml-border-radius: 8px;
				-moz-border-radius: 8px;
				border-radius: 8px;
				border: 1px solid rgba(255, 0, 0, 0.2);
			}
		</style>\n';	
		foreach ($this->vars as $key => $value) {
			$find = ("{".$key."}");
			$style = str_replace($find, $value, $style );
		}
		echo $style;
	}
	*/
	
}

//$maestro = MaestroCore::getInstance();
/**
 * File Loader
 *
 * This function will load file form given paths. Joomla default path style
 *
 * @access	public
 * @param	string	the directory path
 * @return	void
 */
function maestro_import($paths)
{
    $paths = str_replace("\\", '/', $paths);
    $file  = realpath(dirname(__FILE__)) . '/' . $paths . '.php';
    if (file_exists($file)) {
        include_once($file);
    } else {
        die("error: $file does not exist.");
    }
}

function maestro_log($str) {
	echo htmlspecialchars( '<!-- '.chr(13).$str.chr(13).' -->'.chr(13) );
}


function scanLayoutFolder() {

	foreach(glob($this->templatePath . '/assets/layouts/html/*.html') as $filename){
		$path_parts = pathinfo($filename);
		$this->layouts[ $path_parts['filename'] ] = $filename;
	}
	
	foreach(glob($this->templatePath . '/assets/layouts/off-canvas/*.html') as $filename){
		$path_parts = pathinfo($filename);
		$this->layouts[ $path_parts['filename'] ] = $filename;
	}	
}


?>   